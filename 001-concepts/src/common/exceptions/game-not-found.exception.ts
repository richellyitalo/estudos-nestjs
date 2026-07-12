import { HttpException, HttpStatus } from '@nestjs/common';

export class GameNotFoundException extends HttpException {
  constructor(
    response: string = 'Game Not Found',
    code: number = HttpStatus.NOT_FOUND,
  ) {
    super(response, code);
  }
}
