import { Injectable, NotFoundException } from '@nestjs/common';
import Game from './entity/game.entity';
import GameCategory from './entity/game-category.entity';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameCategory)
    private readonly gameCategoryRepository: Repository<GameCategory>,
  ) {}

  private dispatchNotFoundException(message?: string) {
    throw new NotFoundException(message ?? '😭 Game não encontrado.');
  }

  async getAll(): Promise<Game[]> {
    const games = await this.gameRepository.find();

    return games;
  }

  async findOne(id: number): Promise<Game | void> {
    const game = await this.gameRepository.findOneBy({ id });

    if (!game) return this.dispatchNotFoundException();

    return game;
  }

  async findOneByIdInCategorySlug(
    categorySlug: string,
    id: number,
  ): Promise<Game | void> {
    const category = await this.gameCategoryRepository.findOneBy({
      slug: categorySlug,
    });
    if (!category) {
      this.dispatchNotFoundException(
        `Categoria '${categorySlug}' não encontrada`,
      );
    }

    const game = await this.gameRepository.findOneBy({
      id,
      categoryId: category!.id,
    });

    if (!game) return this.dispatchNotFoundException();

    game['category'] = category;

    return game;
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const gameData = {
      ...createGameDto,
    };

    const game = this.gameRepository.create(gameData);

    return await this.gameRepository.save(game);
  }

  async patch(id: number, updateGameDto: UpdateGameDto): Promise<Game | void> {
    const gameData = {
      id,
      ...updateGameDto,
    };

    const game = await this.gameRepository.preload(gameData);

    if (!game) return this.dispatchNotFoundException();

    const res = await this.gameRepository.save(game);

    return res;
  }

  async delete(id: number) {
    const game = await this.gameRepository.findOneBy({ id });

    if (!game) return this.dispatchNotFoundException();

    return await this.gameRepository.remove(game);
  }
}
