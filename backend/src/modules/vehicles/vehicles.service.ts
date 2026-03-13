import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({
        data: {
          companyId,
          brand: dto.brand.trim(),
          model: dto.model.trim(),
          year: dto.year,
          color: normalizeOptional(dto.color),
          plate: normalizePlate(dto.plate),
          chassis: dto.chassis.trim().toUpperCase(),
          currentMileage: dto.currentMileage,
          dailyRate: decimalValue(dto.dailyRate),
          weeklyRate:
            dto.weeklyRate !== undefined ? decimalValue(dto.weeklyRate) : undefined,
          monthlyRate:
            dto.monthlyRate !== undefined ? decimalValue(dto.monthlyRate) : undefined,
          status: dto.status,
        },
      });
    } catch (error) {
      handleVehicleConstraintError(error);
      throw error;
    }
  }

  list(companyId: string, query: QueryVehiclesDto) {
    const where: Prisma.VehicleWhereInput = {
      companyId,
      status: query.status,
      ...(query.search
        ? {
            OR: [
              {
                brand: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                model: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                plate: {
                  contains: normalizePlate(query.search),
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.vehicle.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(companyId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, companyId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veiculo nao encontrado.');
    }

    return vehicle;
  }

  async update(companyId: string, id: string, dto: UpdateVehicleDto) {
    await this.findOne(companyId, id);

    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data: {
          brand: dto.brand?.trim(),
          model: dto.model?.trim(),
          year: dto.year,
          color: normalizeOptional(dto.color),
          plate: dto.plate ? normalizePlate(dto.plate) : undefined,
          chassis: dto.chassis ? dto.chassis.trim().toUpperCase() : undefined,
          currentMileage: dto.currentMileage,
          dailyRate: dto.dailyRate !== undefined ? decimalValue(dto.dailyRate) : undefined,
          weeklyRate:
            dto.weeklyRate !== undefined ? decimalValue(dto.weeklyRate) : undefined,
          monthlyRate:
            dto.monthlyRate !== undefined ? decimalValue(dto.monthlyRate) : undefined,
          status: dto.status,
        },
      });
    } catch (error) {
      handleVehicleConstraintError(error);
      throw error;
    }
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);

    await this.prisma.vehicle.delete({
      where: { id },
    });

    return { success: true };
  }
}

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizePlate(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function decimalValue(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

function handleVehicleConstraintError(error: unknown): never | void {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new ConflictException('Ja existe veiculo com placa ou chassi informados.');
  }
}