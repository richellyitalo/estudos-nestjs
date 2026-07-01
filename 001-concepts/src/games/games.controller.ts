import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

  private readonly games: string[] = ['COD', 'BF6', 'FIFA 24', 'Black Ops 4'];

  @Get()
  all(@Query() query: QueryAll) {
    const { pagination = 10, offset = 0 } = query; // eslint-disable-line
    return this.gamesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Get(':categorySlug/:id')
  findOneByCategory(
    @Param('categorySlug') categorySlug: string,
    @Param('id') id: number,
  ) {
    // @Param() params: any
    return this.gamesService.findOneByIdInCategorySlug(categorySlug, id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createGameDto: CreateGameDto): any {
    // create(@Body('name') name: string): string {
    return this.gamesService.create(createGameDto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): any {
    return this.gamesService.patch(+id, updateGameDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): string {
    this.gamesService.delete(+id);
    return 'Game excluído com sucesso!';
  }
}
