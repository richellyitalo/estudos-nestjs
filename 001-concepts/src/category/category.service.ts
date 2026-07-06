import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const data = {
      ...createCategoryDto,
    };
    try {
      const category = this.categoryRepository.create(data);
      await this.categoryRepository.save(category);

      return category;
    } catch (error: any) {
      // eslint-disable-next-line
      if (error.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(
          `Já existe uma categoria com o mesmo slug '${data.slug}'`,
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      // relations: {
      //   games: true,
      // },
    });

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const data = {
      id,
      ...updateCategoryDto,
    };

    const category = await this.categoryRepository.preload(data);
    try {
      if (!category) throw new NotFoundException('Categoria não encontrada.');

      await this.categoryRepository.save(category);

      return category;
    } catch (error: any) {
      // eslint-disable-next-line
      if (error.code === '23505') {
        throw new ConflictException(
          `Já existe uma categoria com o mesmo slug '${data.slug}'`,
        );
      }

      throw error;
    }
  }

  async findOneBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ slug });
    if (!category) throw new NotFoundException('Categoria não encontrada.');
    return category;
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Categoria não encontrada.');

    return await this.categoryRepository.remove(category);
  }
}
