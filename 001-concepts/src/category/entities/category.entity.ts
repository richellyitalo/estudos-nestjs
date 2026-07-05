import Game from 'src/games/entity/game.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Game, game => game.category)
  games: Game[];

  // Triggers
  @BeforeInsert()
  @BeforeUpdate()
  setSlugLower() {
    this.slug = this.slug.toLowerCase();
  }
}
