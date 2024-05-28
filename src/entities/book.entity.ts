import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrowing } from './borrowing.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  isbn: string;

  @Column()
  quantity: number;

  @Column()
  shelf_location: string;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];
}
