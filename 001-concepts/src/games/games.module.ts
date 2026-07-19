import { forwardRef, Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import GamesService from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Game from './entity/game.entity';
import { CategoryModule } from 'src/category/category.module';
import { GamesUtils } from './games.utils';
import {
  APP_NAME_INDEX,
  APP_NAME_VALUE,
} from 'src/common/constants/config.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), CategoryModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    {
      provide: GamesUtils,
      useClass: GamesUtils,
    },
    {
      provide: APP_NAME_INDEX,
      useValue: APP_NAME_VALUE,
    },
    // GamesUtils], // ou utiliza a classe direta
  ],
  exports: [GamesService, APP_NAME_INDEX],
})
export class GamesModule {}
