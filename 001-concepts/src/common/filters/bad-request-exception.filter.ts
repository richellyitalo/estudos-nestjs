import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import GamesService from 'src/games/games.service';

@Catch(BadRequestException)
@Injectable()
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      statusCode,
      error: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
