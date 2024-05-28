import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrowing } from './borrowing.entity';

@Entity()
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  registered_date: Date;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.borrower)
  borrowings: Borrowing[];
}
