import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';

@Injectable()
export class BookstoreService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // ================= AUTHORS =================
  createAuthor(data: Partial<Author>) {
    const item = this.authorRepo.create(data);
    return this.authorRepo.save(item);
  }

  findAllAuthors() {
    return this.authorRepo.find();
  }

  async findOneAuthor(id: number) {
    const item = await this.authorRepo.findOne({ where: { author_id: id } });
    if (!item) throw new NotFoundException('Author not found');
    return item;
  }

  async updateAuthor(id: number, data: Partial<Author>) {
    await this.authorRepo.update(id, data);
    return this.findOneAuthor(id);
  }

  async removeAuthor(id: number) {
    const item = await this.findOneAuthor(id);
    return this.authorRepo.remove(item);
  }

  // ================= CATEGORIES =================
  createCategory(data: Partial<Category>) {
    const item = this.categoryRepo.create(data);
    return this.categoryRepo.save(item);
  }

  findAllCategories() {
    return this.categoryRepo.find();
  }

  async findOneCategory(id: number) {
    const item = await this.categoryRepo.findOne({ where: { category_id: id } });
    if (!item) throw new NotFoundException('Category not found');
    return item;
  }

  async updateCategory(id: number, data: Partial<Category>) {
    await this.categoryRepo.update(id, data);
    return this.findOneCategory(id);
  }

  async removeCategory(id: number) {
    const item = await this.findOneCategory(id);
    return this.categoryRepo.remove(item);
  }
}