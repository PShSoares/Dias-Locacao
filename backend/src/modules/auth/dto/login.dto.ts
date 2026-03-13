import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  companyDocument!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}