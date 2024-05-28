import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBorrowingDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  borrowerId: number;
}
