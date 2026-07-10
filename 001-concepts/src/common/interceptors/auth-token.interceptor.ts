import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('auth-token-interceptor: start');
    const request: Request = context.switchToHttp().getRequest();

    const token: string | undefined =
      request.headers.authorization?.split(' ')[1];
    if (token !== '123456') {
      throw new UnauthorizedException('Usuário não está autenticado.');
    }
    return next.handle();
  }
}
