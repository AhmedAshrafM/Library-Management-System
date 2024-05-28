import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrowing } from 'src/entities/borrowing.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Borrowing)
    private readonly borrowingRepository: Repository<Borrowing>,
  ) {}

  async generateBorrowingReport(
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const borrowings: Borrowing[] = await this.borrowingRepository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.borrower', 'borrower')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where(
        'borrowing.borrow_date > :startDate AND borrowing.borrow_date < :endDate',
        { startDate, endDate },
      )
      .getMany();

    const worksheet = this.convertToWorksheet(borrowings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Borrowing Report');
    return XLSX.write(workbook, { type: 'buffer' });
  }

  async exportOverdueBorrows(): Promise<Buffer> {
    const date = new Date();
    date.setDate(date.getDate() - 14);
    const overdueBorrows: Borrowing[] = await this.borrowingRepository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.borrower', 'borrower')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where(
        'borrowing.borrow_date < :date AND borrowing.return_date is null ',
        { date },
      )
      .getMany();

    const worksheet = this.convertToWorksheet(overdueBorrows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Overdue Borrows');
    return XLSX.write(workbook, { type: 'buffer' });
  }

  async exportAllBorrowingProcessesLastMonth(): Promise<Buffer> {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );

    const borrowingProcesses: Borrowing[] = await this.borrowingRepository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.borrower', 'borrower')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where('borrowing.borrow_date >= :lastMonth', { lastMonth })
      .getMany();

    const worksheet = this.convertToWorksheet(borrowingProcesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'All Borrowing Processes',
    );
    return XLSX.write(workbook, { type: 'buffer' });
  }

  private convertToWorksheet(borrowings: Borrowing[]): XLSX.WorkSheet {
    const data = borrowings.map((borrowing) => [
      borrowing.id,
      borrowing.borrower.id,
      borrowing.book.id,
      borrowing.borrow_date,
      borrowing.return_date,
    ]);
    const header = [
      'ID',
      'Borrower ID',
      'Book ID',
      'Borrow Date',
      'Return Date',
    ];
    return XLSX.utils.aoa_to_sheet([header, ...data]);
  }
}
