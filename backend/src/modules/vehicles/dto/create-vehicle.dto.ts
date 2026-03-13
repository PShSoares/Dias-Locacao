import { VehicleStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(2)
  brand!: string;

  @IsString()
  @MinLength(2)
  model!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsString()
  @MinLength(5)
  plate!: string;

  @IsString()
  @MinLength(10)
  chassis!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentMileage?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  dailyRate!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  weeklyRate?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyRate?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}