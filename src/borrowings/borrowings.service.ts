import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Borrower } from 'src/entities/borrower.entity';
import { Borrowing } from 'src/entities/borrowing.entity';
import { Repository, LessThan, IsNull } from 'typeorm';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Injectable()
export class BorrowingsService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
    const book = await this.booksRepository.findOneBy({
      id: createBorrowingDto.bookId,
    });
    const borrower = await this.borrowersRepository.findOneBy({
      id: createBorrowingDto.borrowerId,
    });

    if (!book || !borrower) {
      throw new NotFoundException('Book or Borrower not found');
    }

    if (book.quantity < 1) {
      throw new NotFoundException('Book not available');
    }

    book.quantity -= 1;
    await this.booksRepository.save(book);

    const borrowing = this.borrowingsRepository.create({
      book,
      borrower,
      borrow_date: new Date(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Assuming due date is a default of 2 weeks from now
    });

    return this.borrowingsRepository.save(borrowing);
  }

  findAll(): Promise<Borrowing[]> {
    return this.borrowingsRepository.find({
      relations: ['book', 'borrower'],
    });
  }

  async findByBorrower(borrowerId: number): Promise<Borrowing[]> {
    return await this.borrowingsRepository.find({
      where: {
        borrower: { id: borrowerId },
      },
      relations: ['book'],
    });
  }

  async returnBook(borrowerId: number, bookId: number): Promise<Borrowing> {
    const borrowing = await this.borrowingsRepository.findOne({
      where: {
        borrower: { id: borrowerId },
        book: { id: bookId },
        return_date: IsNull(),
      },
      relations: ['book'],
    });
    if (!borrowing) {
      throw new NotFoundException('Borrowing not found');
    }

    borrowing.return_date = new Date();

    const book = borrowing.book;
    book.quantity += 1;
    await this.booksRepository.save(book);

    return this.borrowingsRepository.save(borrowing);
  }

  async findOverdue(): Promise<Borrowing[]> {
    const now = new Date();
    return await this.borrowingsRepository.find({
      where: {
        due_date: LessThan(now),
        return_date: IsNull(),
      },
      relations: ['book', 'borrower'],
    });
  }
}
