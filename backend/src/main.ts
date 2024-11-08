import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { LoggingInterceptor } from './utils/logger.interceptor';
import { SocketIoAdapter } from './utils/ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  configureMiddleware(app);
  configureStaticAssets(app);
  configureWebSocket(app);

  const port = process.env.PORT || 3000;
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}

function configureMiddleware(app) {
  app.enableCors();
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
}

function configureStaticAssets(app) {
  app.use(
    '/avatars',
    express.static(join(__dirname, '..', 'public', 'avatars')),
  );
  app.use('/images', express.static(join(__dirname, '..', 'public', 'images')));
}

function configureWebSocket(app) {
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
}

bootstrap();
