import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class BootstrapAdminDto {
  @IsNotEmpty()
  companyName!: string;

  @IsNotEmpty()
  companyDocument!: string;

  @IsNotEmpty()
  adminName!: string;

  @IsEmail()
  adminEmail!: string;

  @MinLength(6)
  adminPassword!: string;
}