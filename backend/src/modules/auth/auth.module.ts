import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'changeme_local',
        signOptions: {
          expiresIn: parseJwtExpiresIn(
            configService.get<string>('JWT_EXPIRES_IN') ?? '15m',
          ),
        },
      }),
    }),
    CompaniesModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

function parseJwtExpiresIn(value: string): number {
  const normalizedValue = value.trim().toLowerCase();
  const match = normalizedValue.match(/^(\d+)(s|m|h|d)?$/);

  if (!match) {
    return 900;
  }

  const amount = Number(match[1]);
  const unit = match[2] ?? 's';

  switch (unit) {
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 60 * 60 * 24;
    case 's':
    default:
      return amount;
  }
}