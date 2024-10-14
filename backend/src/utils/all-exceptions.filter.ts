import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    // in certain situations, httpAdapter may be undefined
    const { httpAdapter } = this.httpAdapterHost;

    const isProduction = process.env.NODE_ENV === 'production';

    const ctx = host.switchToHttp();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception.message.length < 50) {
      message = exception.message;
    }


    if (exception.statusCode && exception.statusCode === 404) {
      httpStatus = exception.statusCode;
      message = "not found";
    }

    if (exception.status && exception.status === 404) {
      httpStatus = exception.status;
      message = "not found";
    }


    if (exception.response && Array.isArray(exception.response.message)) {
      if (isProduction) {
        message = exception.response.message[0];
      } else {
        message = exception.response.message.join(', ');
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
