import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const IdParam = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = Number(request.params['id']);

    if (isNaN(id)) {
      throw new BadRequestException('Forneça um valor numérico para o ID');
    }
    if (!id) {
      throw new BadRequestException('ID não informado.');
    }

    return +id;
  },
);
