import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);

  // Check if this is a development environment.
  if (
    config
      .get<string>('ENVIRONMENT', 'development')
      .slice(0, 3)
      .toLowerCase() === 'dev'
  ) {
    SwaggerModule.setup(
      'api',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('Notes API')
          .setDescription('The Notes API')
          .addServer(
            `http://localhost:${config.get<string>('PORT', '3000')}/`,
            'Local environment',
          )
          .setVersion('0.0.0')
          .addBearerAuth()
          .build(),
      ),
    );
  }

  await app.listen(config.get<number>('PORT', 3200));
}

void bootstrap();
