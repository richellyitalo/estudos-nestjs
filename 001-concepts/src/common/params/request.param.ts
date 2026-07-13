import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestParam = createParamDecorator(
  (data: keyof Request, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request[data];
  },
);
