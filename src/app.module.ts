import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { AppMongooseModule } from './mongoose.module';
import { AppThrottlerGuard, AppThrottlerModule } from './throttler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppMongooseModule,
    AppThrottlerModule,
    AuthModule,
  ],
  providers: [AppThrottlerGuard],
})
export class AppModule {}
