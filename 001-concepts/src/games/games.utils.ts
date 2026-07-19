import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesUtils {
  getNoteGame(name: string): number {
    console.log('consultando nome do jogo👉', name);
    return 7.8;
  }
}
