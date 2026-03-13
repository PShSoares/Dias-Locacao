import { ClientStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryClientsDto {
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @IsOptional()
  @IsString()
  search?: string;
}