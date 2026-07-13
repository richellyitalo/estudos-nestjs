import {
  ArgumentsHost,
  UnauthorizedException,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
@Injectable()
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const error: object =
      typeof exceptionResponse === 'string'
        ? {
            message: exceptionResponse,
          }
        : exceptionResponse;

    response.status(statusCode).json({
      ...error,
      statusCode,
      // error: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
