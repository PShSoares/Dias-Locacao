import { VehicleStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryVehiclesDto {
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  search?: string;
}