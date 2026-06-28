import { Module } from '@nestjs/common';
import { BaseManualController } from './base-manual.controller';

@Module({
    imports: [],
    controllers: [BaseManualController],
    providers: [],
})
export class BaseManualModule {}
