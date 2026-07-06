import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import UsersService from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  all() {
    return '/all';
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return '/:id 👉 ' + id;
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.signup(createUserDto);
  }

  @Patch(':id')
  patch(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return 'UPDATE 👉 ' + id + ' DATA 👉 ' + JSON.stringify(data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return ':DELETE 👉 ' + id;
  }
}
