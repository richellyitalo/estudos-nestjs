import { forwardRef, Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import GamesService from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Game from './entity/game.entity';
import { CategoryModule } from 'src/category/category.module';
import { GamesUtils } from './games.utils';
import {
  APP_NAME_INDEX,
  APP_NAME_VALUE,
} from 'src/common/constants/config.constant';
import { RegexContract } from 'src/common/utils/regex.contract';
import { RemoveSpaceRegex } from 'src/common/utils/remove-space.regex';
import { KeepOnlyLowerCaseRegex } from 'src/common/utils/keep-only-lowercase.regex';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => CategoryModule)],
  controllers: [GamesController],
  providers: [
    GamesService,
    {
      provide: GamesUtils,
      useClass: GamesUtils,
    },
    // GamesUtils, // ou utiliza a classe direta
    {
      provide: APP_NAME_INDEX,
      useValue: APP_NAME_VALUE,
    },
    {
      provide: RegexContract,
      useClass: 1 !== 1 ? RemoveSpaceRegex : KeepOnlyLowerCaseRegex,
    },
  ],
  exports: [GamesService, APP_NAME_INDEX],
})
export class GamesModule {}
