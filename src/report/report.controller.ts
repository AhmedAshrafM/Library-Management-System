import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Reports')
@Controller('report')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @ApiOperation({
    summary: 'Generate Borrowing Report with start and end date',
  })
  @Get('/borrowing')
  async generateBorrowingReport(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Res() response: Response,
  ): Promise<void> {
    const reportBuffer = await this.reportsService.generateBorrowingReport(
      new Date(startDate),
      new Date(endDate),
    );
    response.set({
      'Content-Disposition': 'attachment; filename=BorrowingReport.xlsx',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    response.send(reportBuffer);
  }

  @ApiOperation({
    summary: 'Generate overdue report',
  })
  @Get('/overdue')
  async exportOverdueBorrows(@Res() response: Response): Promise<void> {
    const reportBuffer = await this.reportsService.exportOverdueBorrows();
    response.set({
      'Content-Disposition': 'attachment; filename=OverdueBorrows.xlsx',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    response.send(reportBuffer);
  }

  @ApiOperation({
    summary: 'Generate report for all borrowing process for the past month',
  })
  @Get('/all')
  async exportAllBorrowingProcessesLastMonth(
    @Res() response: Response,
  ): Promise<void> {
    const reportBuffer =
      await this.reportsService.exportAllBorrowingProcessesLastMonth();
    response.set({
      'Content-Disposition':
        'attachment; filename=AllBorrowingProcessesLastMonth.xlsx',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    response.send(reportBuffer);
  }
}
