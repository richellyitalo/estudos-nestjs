import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import UsersService from 'src/users/users.service';

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Origin', 'Nest-API-Middleware');

    const authorization = req.headers?.authorization;

    if (authorization) {
      const user = await this.userService.getLast();
      req['user'] = {
        ...user,
        role: 'admin',
      };
    }
    // throw new NotFoundException('Problema na API');

    console.log('SimpleMidleware:BEGIN');
    next();

    console.log('SimpleMidleware:AFTER_NEXT');
  }
}
