import { DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';

export const AppThrottlerModule: DynamicModule = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): ThrottlerModuleOptions => [
    {
      ttl: Number(config.get<number>('THROTTLER_TTL', 60000)),
      limit: Number(config.get<number>('THROTTLER_LIMIT', 10)),
    },
  ],
});

export const AppThrottlerGuard: Provider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
