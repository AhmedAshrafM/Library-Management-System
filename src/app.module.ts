import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { BorrowingsModule } from './borrowings/borrowings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { env } from 'node:process';
import { Borrower } from './entities/borrower.entity';
import { Borrowing } from './entities/borrowing.entity';
import { Book } from './entities/book.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [Book, Borrower, Borrowing],
      synchronize: true,
    }),
    BooksModule,
    BorrowersModule,
    BorrowingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
