import { Module } from '@nestjs/common';
import { BaseCliController } from './base-cli.controller';

@Module({
  controllers: [BaseCliController],
})
export class BaseCliModule {}
