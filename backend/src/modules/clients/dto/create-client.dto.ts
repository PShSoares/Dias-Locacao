import { ClientStatus, ClientType } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsEnum(ClientType)
  type!: ClientType;

  @IsString()
  @MinLength(3)
  fullName!: string;

  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @IsOptional()
  @IsString()
  rgIe?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;
}