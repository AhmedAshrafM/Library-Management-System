import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateBorrowerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
