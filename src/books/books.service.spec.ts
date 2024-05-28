import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from '../entities/book.entity';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books: Book[] = [
        {
          title: 'New Book',
          author: 'Author Name',
          isbn: '1234567890',
          quantity: 2,
          shelf_location: 'EXT2A',
          id: 1,
          borrowings: [],
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(books);

      const result = await service.findAll();

      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a book with the specified id', async () => {
      const book: Book = {
        title: 'New Book',
        author: 'Author Name',
        isbn: '1234567890',
        quantity: 2,
        shelf_location: 'EXT2A',
        id: 1,
        borrowings: [],
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(book);

      const result = await service.findOne(1);

      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book with specified id is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

      await expect(service.findOne(1000)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'Author Name',
        isbn: '1234567890',
        quantity: 2,
        shelf_location: 'EXT2A',
      };
      const newBook = { id: 1, ...createBookDto, borrowings: [] };
      jest
        .spyOn(repository, 'create')
        .mockReturnValue({ ...newBook, id: 1, borrowings: [] });
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...newBook, id: 1, borrowings: [] });

      const result = await service.create(createBookDto);

      expect(result).toEqual(newBook);
    });
  });

  describe('update', () => {
    it('should update the book with the specified id', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Author Name',
        isbn: '1234567890',
        quantity: 2,
        shelf_location: 'EXT2A',
      };
      const book: Book = {
        title: 'New Book',
        author: 'Author Name',
        isbn: '1234567890',
        quantity: 2,
        shelf_location: 'EXT2A',
        id: 1,
        borrowings: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.update(1, updateBookDto);

      expect(result).toEqual({ ...book, ...updateBookDto });
    });

    it('should throw NotFoundException if book with specified id is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
      };

      await expect(service.update(1, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the book with the specified id', async () => {
      const book: Book = {
        title: 'New Book',
        author: 'Author Name',
        isbn: '1234567890',
        quantity: 2,
        shelf_location: 'EXT2A',
        id: 1,
        borrowings: [],
      };
      const result: DeleteResult = { affected: 1, raw: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'delete').mockResolvedValue(result);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book with specified id is not found', async () => {
      const result: DeleteResult = { affected: 0, raw: 0 };
      jest.spyOn(repository, 'delete').mockResolvedValue(result);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
