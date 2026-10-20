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

import { CustomersService } from '../customers/customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  // Only admins can view all customers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getAll() {
    return this.customersService.getAll();
  }

  // Any authenticated user can view a single customer
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.customersService.findById(+id);
  }

  // Any authenticated user can create a customer
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: { name: string; email: string; phone?: string; address?: string },
  ) {
    return this.customersService.createCustomer(
      body.name,
      body.email,
      body.phone,
      body.address,
    );
  }

  // Only admins can update customer records
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.customersService.updateCustomer(+id, body);
  }

  // Only admins can delete customers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customersService.deleteCustomer(+id);
  }
}