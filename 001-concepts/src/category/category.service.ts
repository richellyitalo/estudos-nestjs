import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const data = {
      ...createCategoryDto,
      slug: createCategoryDto.slug.toLowerCase(),
    };
    try {
      const category = this.categoryRepository.create(data);
      await this.categoryRepository.save(category);

      return category;
    } catch (error: any) {
      if (error.code === '23505') {
        // eslint-disable-line
        throw new ConflictException(
          `Já existe uma categoria com o mesmo slug '${data.slug}'`,
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

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
      if (error.code === '23505') {
        // eslint-disable-line
        throw new ConflictException(
          `Já existe uma categoria com o mesmo slug '${data.slug}'`,
        );
      }

      throw error;
    }
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Categoria não encontrada.');

    await this.categoryRepository.remove(category);

    return category;
  }
}
