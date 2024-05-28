import { Module } from '@nestjs/common';
import { BorrowersController } from './borrowers.controller';
import { BorrowersService } from './borrowers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from 'src/entities/borrower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower])],
  controllers: [BorrowersController],
  providers: [BorrowersService],
})
export class BorrowersModule {}
