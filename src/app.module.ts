import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { AppMongooseModule } from './mongoose.module';
import { AppThrottlerGuard, AppThrottlerModule } from './throttler.module';
import { NotesModule } from './modules/notes/notes.module';
import { FoldersModule } from './modules/folders/folders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppMongooseModule,
    AppThrottlerModule,
    AuthModule,
    FoldersModule,
    NotesModule,
  ],
  providers: [AppThrottlerGuard],
})
export class AppModule {}
