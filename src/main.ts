import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import {
  ResponseInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { AllExceptionsFilter } from './common/http-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'verbose', 'warn'],
  });
  const configService = app.get(ConfigService);
  const swaggerUser = configService.get<string>('SWAGGER_USER');
  const swaggerPass = configService.get<string>('SWAGGER_PASSWORD');
  const swaggerRouter = configService.get<string>('SWAGGER_ROUTER');
  if (!swaggerUser || !swaggerPass || !swaggerRouter)
    throw new Error('Swagger params are not defined');
  app.use(
    [`/${swaggerRouter}`],
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPass,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('API Mapa CECOM')
    .setDescription('API para gestionar cámaras y usuarios')
    .setVersion('1.0')
    .addTag('mapa-cecom')
    .addBearerAuth()
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerRouter, app, documentFactory);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    AppValidationPipe,
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port ?? 3000);
  logger.verbose(`Server running on port ${port}`);
}
bootstrap();
