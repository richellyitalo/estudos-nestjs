import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SecondMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SecondMiddleware:begin');
    next();
    console.log('SecondMiddleware:afterNext');
  }
}
