import { Category } from 'src/categories/entities/category.entity';
import { Travel } from 'src/travels/entities/travel.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  location: string;

  @Column()
  members: number;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  travelId: number;

  @ManyToOne(() => Travel, (travel) => travel.id)
  travel: Travel;

  @ManyToOne(() => Activity, (activity) => activity.id)
  category: Category;
}
