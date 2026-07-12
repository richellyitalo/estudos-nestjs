import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from 'src/games/games.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import UsersModule from 'src/users/users.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import UsersService from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { SecondMiddleware } from 'src/common/middlewares/second.middleware';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';
import { GameNotFoundExceptionFilter } from 'src/common/filters/game-not-found-exception.filter';
import { AllHttpExceptionFilter } from 'src/common/filters/all-http-exception.filter';

// Config: DB
const dbConnectionOptions: object = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dbConnectionOptions,
      autoLoadEntities: true, // carrega automaticamente as entidades dos modulos
      synchronize: true, // sincroniza as entidades com o banco de dados
    }),
    TypeOrmModule.forFeature([User]),
    GamesModule,
    CategoryModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GameNotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, SecondMiddleware).forRoutes('*');
  }
}
