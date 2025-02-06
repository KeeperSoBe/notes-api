import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const AppMongooseModule: DynamicModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): MongooseModuleFactoryOptions => ({
    uri: config.get<string>('DB_HOST', 'mongodb://localhost/'),
    user: config.get<string>('DB_USER', 'root'),
    pass: config.get<string>('DB_PASS', 'secret'),
    dbName: config.get<string>('DB_NAME', 'notes'),
  }),
});
