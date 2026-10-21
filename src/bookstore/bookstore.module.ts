
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';
import { BookstoreController } from './bookstore.controller';
import { BookstoreService } from './bookstore.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author, Category]),
  ],
  controllers: [BookstoreController],
  providers: [BookstoreService],
  exports: [BookstoreService],
})
export class BookstoreModule {}
