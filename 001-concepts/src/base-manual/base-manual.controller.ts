import { Controller, Get } from '@nestjs/common';

@Controller()
export class BaseManualController {
  @Get()
  getHello(): number[] {
    return [1, 2, 3];
  }
}
