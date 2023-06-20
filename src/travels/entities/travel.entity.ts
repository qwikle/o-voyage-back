import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ type: 'timestamptz' })
  departureDate: Date;

  @Column({ type: 'timestamptz' })
  arrivalDate: Date;

  @Column()
  budget: number;

  @Column()
  numberOfAttendees: number;

  @Column()
  organizerId: number;

  @ManyToOne(() => User, (user) => user.id)
  organizer: User;
}
