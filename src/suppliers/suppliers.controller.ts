import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async getAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.suppliersService.findById(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  async create(
    @Body() body: { name: string; contact_person?: string; phone?: string; email?: string; address?: string },
  ) {
    return this.suppliersService.createSupplier(
      body.name,
      body.contact_person,
      body.phone,
      body.email,
      body.address,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.updateSupplier(+id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.suppliersService.deleteSupplier(+id);
  }
}