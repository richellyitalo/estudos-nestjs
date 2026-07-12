import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GameNotFoundException } from '../exceptions/game-not-found.exception';
import { Request, Response } from 'express';

@Catch(GameNotFoundException)
export class GameNotFoundExceptionFilter<
  T extends HttpException,
> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const gameId = request.params?.id ?? null;

    response.status(exception.getStatus()).json({
      message: exception.message,
      gameId,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
