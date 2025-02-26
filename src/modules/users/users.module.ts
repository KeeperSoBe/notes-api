import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import HashService from '../../shared/services/hash.service';
import { FoldersModule } from '../folders/folders.module';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    FoldersModule,
  ],
  providers: [UsersService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
