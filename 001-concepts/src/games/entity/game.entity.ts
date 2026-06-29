import GameCategory from './game-category.entity';

export default class Game {
  id: number;
  name: string;
  year: number;
  categoryId: number;
  category?: GameCategory;
  created: Date;
}
