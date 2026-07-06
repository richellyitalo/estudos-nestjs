import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { omit } from 'src/shared/utils/omit.util';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async all(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        id: 'desc',
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);

      // eslint-disable-next-line
      const { password, ...userPayload } = await this.userRepository.save(user);
      return userPayload as User;
    } catch (error) {
      // estlint-disable-next-line
      if (error?.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(
          `Email '${createUserDto.email}' duplicado. Informe um outro e-mail.`,
        );
      }

      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.preload({ id, ...updateUserDto });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      await this.userRepository.save(user);

      return omit(user, ['password']) as User;
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException(
          `Não é possível atualizar o email para '${updateUserDto.email}'. Informe um outro e-mail.`,
        );
      }

      throw error;
    }
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    return user ? (omit(user, ['password']) as User) : null;
  }

  async delete(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Não foi possível excluir o usuário.');
    }

    const userRemoved = await this.userRepository.remove(user);
    if (!userRemoved) {
      throw new HttpException(
        'Não foi possível remover o usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return omit(userRemoved, ['password']) as User;
  }
}
