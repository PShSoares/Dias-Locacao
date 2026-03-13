import { Injectable } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';

type CreateUserInput = {
  companyId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByCompanyAndEmail(companyId: string, email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        companyId_email: {
          companyId,
          email,
        },
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(input: CreateUserInput, tx?: Prisma.TransactionClient): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const client = tx ?? this.prisma;

    return client.user.create({
      data: {
        companyId: input.companyId,
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
      },
    });
  }

  updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }
}