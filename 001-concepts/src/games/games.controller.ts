import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import GamesService from './games.service';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';

interface QueryAll {
  pagination?: number;
  offset?: number;
}

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  all(@Query() query: QueryAll) {
    const { pagination = 10, offset = 0 } = query; // eslint-disable-line
    return this.gamesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Get(':categorySlug/:id')
  findOneByCategory(
    @Param('categorySlug') categorySlug: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.gamesService.findOneByIdInCategorySlug(categorySlug, id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createGameDto: CreateGameDto): any {
    // create(@Body('name') name: string): string {
    return this.gamesService.create(createGameDto);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameDto: UpdateGameDto,
  ): any {
    return this.gamesService.patch(id, updateGameDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    await this.gamesService.delete(id);
    return 'Game excluído com sucesso!';
  }
}
