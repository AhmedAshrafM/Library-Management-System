import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from 'src/entities/borrower.entity';
import { Repository } from 'typeorm';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  create(createBorrowerDto: CreateBorrowerDto): Promise<Borrower> {
    const borrower = this.borrowersRepository.create({
      ...createBorrowerDto,
      registered_date: new Date(),
    });
    return this.borrowersRepository.save(borrower);
  }

  findAll(): Promise<Borrower[]> {
    return this.borrowersRepository.find();
  }

  findOne(id: number): Promise<Borrower> {
    return this.borrowersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateBorrowerDto: UpdateBorrowerDto,
  ): Promise<Borrower> {
    const borrower = await this.findOne(id);
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }
    Object.assign(borrower, updateBorrowerDto);
    return this.borrowersRepository.save(borrower);
  }

  async remove(id: number): Promise<void> {
    const result = await this.borrowersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Borrower not found');
    }
  }
}
