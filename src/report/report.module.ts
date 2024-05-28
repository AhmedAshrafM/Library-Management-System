import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Borrowing } from 'src/entities/borrowing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
