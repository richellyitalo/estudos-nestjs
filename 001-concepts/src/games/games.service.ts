import { Injectable, NotFoundException } from '@nestjs/common';
import Game from './entity/game.entity';
import { CreateGameDto } from './dto/create-game-dto';
import { UpdateGameDto } from './dto/update-game-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export default class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly categoryService: CategoryService,
  ) {}

  private dispatchNotFoundException(message?: string) {
    throw new NotFoundException(message ?? '😭 Game não encontrado.');
  }

  async getAll(): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: {
        category: true,
      },
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
      },
      select: {
        category: {
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    if (!game) this.dispatchNotFoundException();

    return game;
  }

  findOneByIdInCategorySlug(categorySlug: string, id: number): null {
    return null;
    // const category = await this.gameCategoryRepository.findOneBy({
    //   slug: categorySlug,
    // });
    // if (!category) {
    //   this.dispatchNotFoundException(
    //     `Categoria '${categorySlug}' não encontrada`,
    //   );
    // }

    // const game = await this.gameRepository.findOneBy({
    //   id,
    //   categoryId: category!.id,
    // });

    // if (!game) return this.dispatchNotFoundException();

    // game['category'] = category;

    // return game;
  }

  async create(createGameDto: CreateGameDto): Promise<any> {
    const category = await this.categoryService.findOne(
      createGameDto.categoryId,
    );

    const { name, year } = createGameDto;

    const game = this.gameRepository.create({
      name,
      year,
      category,
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
}
