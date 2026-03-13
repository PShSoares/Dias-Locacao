import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Company, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    company: {
      id: string;
      name: string;
      document: string | null;
    };
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async bootstrapAdmin(dto: BootstrapAdminDto): Promise<AuthResponse> {
    const companyDocument = normalizeCompanyDocument(dto.companyDocument);
    const email = normalizeEmail(dto.adminEmail);

    const existingCompany = await this.companiesService.findByDocument(companyDocument);

    if (existingCompany) {
      throw new ConflictException('A empresa informada ja foi configurada.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName.trim(),
          document: companyDocument,
        },
      });

      const user = await this.usersService.create(
        {
          companyId: company.id,
          name: dto.adminName.trim(),
          email,
          password: dto.adminPassword,
          role: UserRole.ADMIN,
        },
        tx,
      );

      return { company, user };
    });

    await this.usersService.updateLastLogin(result.user.id);

    return this.buildAuthResponse(result.user, result.company);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const companyDocument = normalizeCompanyDocument(dto.companyDocument);
    const email = normalizeEmail(dto.email);

    const company = await this.companiesService.findByDocument(companyDocument);

    if (!company) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const user = await this.usersService.findByCompanyAndEmail(company.id, email);

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.buildAuthResponse(user, company);
  }

  async getProfile(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.active) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: payload.companyId },
    });

    if (!company) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    return {
      user: this.serializeUser(user, company),
    };
  }

  private async buildAuthResponse(user: User, company: Company): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: company.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.serializeUser(user, company),
    };
  }

  private serializeUser(user: User, company: Company) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: {
        id: company.id,
        name: company.name,
        document: company.document,
      },
    };
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeCompanyDocument(document: string): string {
  return document.replace(/\D/g, '');
}