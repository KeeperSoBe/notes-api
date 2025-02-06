import { DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthGuard } from './modules/auth/guards/auth.guard';

export const AppJwtModule: DynamicModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): JwtModuleOptions => ({
    global: true,
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '60s') },
  }),
});

export const AppAuthGuard: Provider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
