import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import GamesService from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Game from './entity/game.entity';
import GameCategory from './entity/game-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameCategory])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
