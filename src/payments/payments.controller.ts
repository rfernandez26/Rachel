import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() body: { orderId: number; amount: number; paymentMethod: string; status?: string }) {
    return this.paymentsService.createPayment(body.orderId, body.amount, body.paymentMethod, body.status);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  // Put specific routes BEFORE the generic :id route
  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrderId(+orderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findById(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.paymentsService.updateStatus(+id, status);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentsService.deletePayment(+id);
  }
}