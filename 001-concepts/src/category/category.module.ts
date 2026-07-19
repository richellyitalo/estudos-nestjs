import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => GamesModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
