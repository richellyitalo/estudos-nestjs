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

interface QueryAll {
  pagination?: number;
  offset?: number;
}

@Controller('games')
export class GamesController {
  private readonly games: string[] = ['COD', 'BF6', 'FIFA 24', 'Black Ops 4'];

  @Get()
  all(@Query() query: QueryAll): string[] {
    // const { pagination = 10, offset = 0 } = query;
    const { pagination = 10, offset = 0 } = query;
    console.log(`pagination=${pagination}, offset=${offset}`);
    return this.games;
  }

  @Get(':id')
  findOne(@Param('id') id: number): string {
    return this.games[id - 1];
  }

  @Get(':categoryName/:id')
  findOneByCategory(
    @Param('categoryName') categoryName: string,
    @Param('id') id: number,
    // @Param() params: any
  ): string {
    return `Jogo de id ${id} na Categoria: ${categoryName}`;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() body: any): string {
    // create(@Body('name') name: string): string {
    console.log(body);
    return 'Jogo registrado com sucesso!';
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() body: object): string {
    const data = {
      id,
      ...body,
    };
    console.log(data);
    return 'Jogo atualizado com sucesso';
  }

  @Delete(':id')
  delete(@Param('id') id: string): string {
    return `Jogo ${id} excluído 🗑️!`;
  }
}
