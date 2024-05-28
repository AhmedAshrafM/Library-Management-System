import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Borrower } from './borrower.entity';

@Entity()
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrowings)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Borrower, (borrower) => borrower.borrowings)
  @JoinColumn({ name: 'borrower_id' })
  borrower: Borrower;

  @Column()
  borrow_date: Date;

  @Column()
  due_date: Date;

  @Column({ nullable: true })
  return_date: Date;
}
