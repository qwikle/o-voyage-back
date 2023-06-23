import { Activity } from '../../activities/entities/activity.entity';
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
