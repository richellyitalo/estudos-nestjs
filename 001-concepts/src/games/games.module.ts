import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import GamesService from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Game from './entity/game.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), CategoryModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
