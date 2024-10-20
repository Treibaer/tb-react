import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { LoggingInterceptor } from './utils/logger.interceptor';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SocketIoAdapter } from './utils/ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors();

  // Increase the limit to 10MB for example (adjust as necessary)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  console.log(`Listening on port ${port}`);

  app.use(
    '/avatars',
    express.static(join(__dirname, '..', 'public', 'avatars')),
  );
  app.use('/images', express.static(join(__dirname, '..', 'public', 'images')));

  const configService = app.get(ConfigService);
  
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  await app.listen(port);
}
bootstrap();
