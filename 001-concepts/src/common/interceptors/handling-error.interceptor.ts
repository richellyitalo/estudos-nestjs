import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class HandlingErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Interceptor: handling-error');

    return next.handle().pipe(
      catchError((error: Error) => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(
              `Mensagem interceptada: ${error.message}`,
            );
          }

          return new BadRequestException('Erro desconhecido');
        });
      }),
    );
  }
}
