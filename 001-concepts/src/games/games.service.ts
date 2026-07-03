import { Injectable, NotFoundException } from '@nestjs/common';
import Game from './entity/game.entity';
import GameCategory from './entity/game-category.entity';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';

@Injectable()
export default class GamesService {
  private lastId = 1;

  private categories: GameCategory[] = [
    {
      id: 1,
      name: 'Ação',
      slug: 'acao',
      created: new Date(),
    },
    {
      id: 2,
      name: 'Aventura',
      slug: 'aventura',
      created: new Date(),
    },
  ];

  private games: Game[] = [
    {
      id: this.lastId,
      categoryId: 1,
      name: 'Resident Evil HD Remastered',
      year: 2018,
      created: new Date(),
    },
  ];

  dispatchNotFoundException(message?: string) {
    throw new NotFoundException(message ?? '😭 Game não encontrado.');
  }

  getAll(): Game[] {
    return this.games.map(game => {
      game.category = this.getCategoryById(game.categoryId);
      return game;
    });
  }

  findOne(id: number) {
    const game = this.games.find(game => game.id === id);
    if (!game) {
      this.dispatchNotFoundException();
    }

    game!.category = this.getCategoryById(game!.categoryId);

    return game;
  }

  getCategoryById(categoryId: number) {
    return this.categories.find(category => category.id === categoryId);
  }

  getCategoryBySlug(categorySlug: string) {
    const index = this.categories.findIndex(
      category => category.slug === categorySlug,
    );
    if (index < 0) {
      return;
    }

    return this.categories[index];
  }

  findOneByIdInCategorySlug(categorySlug: string, id: number) {
    const category = this.getCategoryBySlug(categorySlug);
    if (!category) {
      this.dispatchNotFoundException(
        `Categoria '${categorySlug}' não encontrada`,
      );
    }

    const game: Game | undefined = this.games.find(
      game => game.id === +id && game.categoryId === category!.id,
    );

    if (!game) {
      this.dispatchNotFoundException();
    }

    game!.category = category;

    return game;
  }

  create(createGameDto: CreateGameDto): any {
    this.lastId++;
    const id = this.lastId;
    const created = new Date();

    console.log(createGameDto);

    const newGame: Game = {
      id,
      created,
      ...createGameDto,
    };

    this.games.push(newGame);

    newGame.category = this.getCategoryById(newGame.categoryId);

    return newGame;
  }

  patch(id: number, updateGameDto: UpdateGameDto): any {
    const gameIndex = this.games.findIndex(game => game.id === +id);
    if (gameIndex < 0) {
      this.dispatchNotFoundException();
    }

    const game = this.games[gameIndex];

    // eslint-disable-next-line
    const gamePatched = {
      ...game,
      ...updateGameDto,
      id,
    };

    this.games[gameIndex] = gamePatched; // eslint-disable-line

    // eslint-disable-next-line
    gamePatched.category = this.getCategoryById(gamePatched.categoryId);

    return gamePatched;
  }

  delete(id: number) {
    const gameIndex: number = this.games.findIndex(game => game.id === +id);
    if (gameIndex < 0) {
      this.dispatchNotFoundException();
    }

    this.games.splice(gameIndex, 1);
  }
}
