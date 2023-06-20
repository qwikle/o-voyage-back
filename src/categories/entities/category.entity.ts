import { Activity } from 'src/graphql';
import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Category, (category) => category.id)
  activities: Activity;
}
