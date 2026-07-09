import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AddHeadeResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    // eslint-disable-next-line
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const afterMs = Date.now() - now;

        // eslint-disable-next-line
        response.setHeader('x-Timing-Processing', `${afterMs}ms`);
      }),
    );
  }
}
