import { Activity } from 'src/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, (category) => category.id)
    activity: Activity;

}
