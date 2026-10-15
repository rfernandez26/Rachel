import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookstoreService } from './bookstore.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class BookstoreController {
  constructor(private readonly bookstoreService: BookstoreService) {}

  // ================= AUTHORS =================
  @UseGuards(JwtAuthGuard)
  @Post('authors')
  createAuthor(@Body() body: any) {
    return this.bookstoreService.createAuthor(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('authors')
  findAllAuthors() {
    return this.bookstoreService.findAllAuthors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('authors/:id')
  findOneAuthor(@Param('id') id: string) {
    return this.bookstoreService.findOneAuthor(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('authors/:id')
  updateAuthor(@Param('id') id: string, @Body() body: any) {
    return this.bookstoreService.updateAuthor(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('authors/:id')
  removeAuthor(@Param('id') id: string) {
    return this.bookstoreService.removeAuthor(+id);
  }

  // ================= CATEGORIES =================
  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() body: any) {
    return this.bookstoreService.createCategory(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  findAllCategories() {
    return this.bookstoreService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.bookstoreService.findOneCategory(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.bookstoreService.updateCategory(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.bookstoreService.removeCategory(+id);
  }
}