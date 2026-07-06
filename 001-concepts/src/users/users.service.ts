import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);

      // eslint-disable-next-line
      const { password, ...userPayload } = await this.userRepository.save(user);
      return userPayload as User;
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException(
          `Email '${createUserDto.email}' duplicado. Informe um outro e-mail.`,
        );
      }

      throw error;
    }
  }
}
