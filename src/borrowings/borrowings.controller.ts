import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  create(@Body() createBorrowingDto: CreateBorrowingDto) {
    return this.borrowingsService.create(createBorrowingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.borrowingsService.findAll();
  }

  @Get('check/:id')
  @UseGuards(JwtAuthGuard)
  findByBorrower(@Param('id') id: number) {
    return this.borrowingsService.findByBorrower(id);
  }

  @Put('return/:bookId/:borrowerId')
  @UseGuards(JwtAuthGuard)
  returnBook(
    @Param('bookId') bookId: number,
    @Param('borrowerId') borrowerId: number,
  ) {
    return this.borrowingsService.returnBook(borrowerId, bookId);
  }

  @Get('overdue')
  @UseGuards(JwtAuthGuard)
  findOverdue() {
    return this.borrowingsService.findOverdue();
  }
}
