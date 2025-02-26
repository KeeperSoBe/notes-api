import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppAuthGuard, AppJwtModule } from '../../jwt.module';
import HashService from '../../shared/services/hash.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService, AppAuthGuard, HashService],
  exports: [AuthService],
})
export class AuthModule {}
