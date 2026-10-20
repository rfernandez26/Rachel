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

import { AuthorsService } from './authors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  // Get all authors (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.authorsService.getAll();
  }

  // Get single author by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.authorsService.findById(+id);
  }

  // Create author (protected)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { name: string; bio?: string; email?: string }) {
    return this.authorsService.createAuthor(
      body.name,
      body.bio,
      body.email,
    );
  }

  // Update author (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.authorsService.updateAuthor(+id, body);
  }

  // Delete author (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authorsService.deleteAuthor(+id);
  }
}