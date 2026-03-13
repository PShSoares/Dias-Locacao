import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        companyId,
        type: dto.type,
        fullName: dto.fullName.trim(),
        cpfCnpj: normalizeOptional(dto.cpfCnpj),
        rgIe: normalizeOptional(dto.rgIe),
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        phone: normalizeOptional(dto.phone),
        email: dto.email ? dto.email.trim().toLowerCase() : undefined,
        status: dto.status,
      },
    });
  }

  list(companyId: string, query: QueryClientsDto) {
    const where: Prisma.ClientWhereInput = {
      companyId,
      status: query.status,
      ...(query.search
        ? {
            OR: [
              {
                fullName: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                cpfCnpj: {
                  contains: onlyDigits(query.search),
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.client.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) {
      throw new NotFoundException('Cliente nao encontrado.');
    }

    return client;
  }

  async update(companyId: string, id: string, dto: UpdateClientDto) {
    await this.findOne(companyId, id);

    return this.prisma.client.update({
      where: { id },
      data: {
        type: dto.type,
        fullName: dto.fullName?.trim(),
        cpfCnpj: dto.cpfCnpj ? onlyDigits(dto.cpfCnpj) : dto.cpfCnpj,
        rgIe: normalizeOptional(dto.rgIe),
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        phone: normalizeOptional(dto.phone),
        email: dto.email ? dto.email.trim().toLowerCase() : dto.email,
        status: dto.status,
      },
    });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);

    await this.prisma.client.delete({
      where: { id },
    });

    return { success: true };
  }
}

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}