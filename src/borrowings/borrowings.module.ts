import { Module } from '@nestjs/common';
import { BorrowingsController } from './borrowings.controller';
import { BorrowingsService } from './borrowings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Borrower } from 'src/entities/borrower.entity';
import { Borrowing } from 'src/entities/borrowing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing, Book, Borrower])],
  controllers: [BorrowingsController],
  providers: [BorrowingsService],
})
export class BorrowingsModule {}
