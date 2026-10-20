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

import { OrderItemsService } from './order-item.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}

  // Get all order items (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderItemsService.getAll();
  }

  // Get single order item by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderItemsService.findById(+id);
  }

  // Get order items by order_id (protected)
  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  async getByOrder(@Param('orderId') orderId: string) {
    return this.orderItemsService.findByOrderId(+orderId);
  }

  // Create order item (protected)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      product_id: number;
      quantity: number;
      price: number;
    },
  ) {
    return this.orderItemsService.createOrderItem(
      body.order_id,
      body.product_id,
      body.quantity,
      body.price,
    );
  }

  // Update order item (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.orderItemsService.updateOrderItem(+id, body);
  }

  // Delete order item (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderItemsService.deleteOrderItem(+id);
  }
}