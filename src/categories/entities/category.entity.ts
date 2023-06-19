import { Activity } from 'src/graphql';
import { Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Category, (category) => category.id)
    activities: Activity;

}
