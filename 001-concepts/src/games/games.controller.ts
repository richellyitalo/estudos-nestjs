import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import GamesService from './games.service';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIdAsNumberPipe } from 'src/common/pipes/parse-id-as-number.pipe';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import type { Request } from 'express';
import { IdParam } from 'src/common/params/id.param';
import { RequestParam } from 'src/common/params/request.param';
import { APP_NAME_INDEX } from 'src/common/constants/config.constant';

@UseInterceptors(AuthTokenInterceptor)
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    @Inject(APP_NAME_INDEX)
    private readonly appName: string,
  ) {}

  @Get()
  // @UseInterceptors(CountArrayLengthInterceptorInterceptor)
  async all(@Query() paginationDto: PaginationDto, @Req() request: Request) {
    console.log('APP_NAME=>', this.appName);
    return await this.gamesService.getAll(paginationDto);
  }

  @Get(':id')
  // @UsePipes(new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
  async findOne(
    @IdParam() id: number,
    @RequestParam('url') url: string,
    // @Param('id', ParseIdAsNumberPipe)
    // id: number,
  ): Promise<any> {
    return {
      ...(await this.gamesService.findOne(id)),
      url,
    };
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
