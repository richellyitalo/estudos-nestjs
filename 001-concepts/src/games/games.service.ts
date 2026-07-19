import { Injectable, NotFoundException } from '@nestjs/common';
import Game from './entity/game.entity';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GameNotFoundException } from 'src/common/exceptions/game-not-found.exception';
import { GamesUtils } from './games.utils';

@Injectable()
export default class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly categoryService: CategoryService,
    private readonly gamesUtils: GamesUtils,
  ) {}

  private dispatchNotFoundException(message?: string): never {
    throw new NotFoundException(message ?? '😭 Game não encontrado.');
  }

  async getAll(paginationDto: PaginationDto): Promise<Game[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    const games = await this.gameRepository.find({
      relations: {
        category: true,
      },
      take: limit,
      skip: offset,
      select: {
        category: {
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    return games;
  }

  async findOne(id: number): Promise<Game | null> {
    const game = await this.gameRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        user: true,
      },
      select: {
        user: {
          name: true,
        },
        category: {
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    // if (!game) this.dispatchNotFoundException();
    if (!game) throw new GameNotFoundException('Jogo não encontrado 🕹😭');

    return { ...game, note: this.gamesUtils.getNoteGame(game.name) } as Game;
  }

  async findOneByIdInCategorySlug(
    categorySlug: string,
    id: number,
  ): Promise<Game> {
    const category = await this.categoryService.findOneBySlug(categorySlug);
    if (!category) {
      this.dispatchNotFoundException(
        `Categoria '${categorySlug}' não encontrada`,
      );
    }

    // const game = await this.gameRepository.findOneBy({
    //   id,
    //   category: {
    //     id: category.id,
    //   },
    // });

    const game = await this.gameRepository.findOneBy({
      id,
      categoryId: category.id,
    });

    if (!game) this.dispatchNotFoundException();

    return {
      ...game,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    } as Game;
  }

  async create(createGameDto: CreateGameDto): Promise<any> {
    // TODO: resgatar id da sessao
    const ID_USER: number = 9;

    const category = await this.categoryService.findOne(
      createGameDto.categoryId,
    );

    const { name, year } = createGameDto;

    const game = this.gameRepository.create({
      name,
      year,
      category,
      user: {
        id: ID_USER,
      },
    });

    await this.gameRepository.save(game);

    return {
      ...game,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    };
  }

  async patch(id: number, updateGameDto: UpdateGameDto) {
    const recado = await this.findOne(id);

    const category = updateGameDto?.categoryId
      ? await this.categoryService.findOne(updateGameDto.categoryId)
      : recado!.category;

    const game = await this.gameRepository.preload({
      id,
      ...updateGameDto,
      category,
    });

    if (!game) return this.dispatchNotFoundException();

    try {
      const gameUpdated = await this.gameRepository.save(game);

      return {
        ...gameUpdated,
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async delete(id: number) {
    const game = await this.gameRepository.findOneBy({ id });

    if (!game) return this.dispatchNotFoundException();

    // retorna instancia sem o campo ID
    return await this.gameRepository.remove(game);
  }

  async getLast(): Promise<Game | null> {
    const game = await this.gameRepository.find({
      take: 1,
      order: {
        id: 'desc',
      },
    });

    return game[0] ?? null;
  }
}
