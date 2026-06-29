import { Controller, Get } from '@nestjs/common';

@Controller('base-cli')
export class BaseCliController {
  @Get()
  home(): string {
    return 'Base-cli-->Home';
  }

  @Get('about')
  about(): string {
    return 'Base-cli@About';
  }
}
