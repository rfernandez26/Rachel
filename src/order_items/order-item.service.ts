import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrderItemsService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createOrderItem(
    order_id: number,
    product_id: number,
    quantity: number,
    price: number,
  ) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, product_id, quantity, price],
    );

    return { id: result.insertId, order_id, product_id, quantity, price };
  }

  async findById(id: number) {
    const [rows]: any = await this.pool().execute(
      'SELECT id, order_id, product_id, quantity, price, created_at FROM order_items WHERE id = ?',
      [id],
    );

    if (!rows[0]) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    return rows[0];
  }

  async findByOrderId(orderId: number) {
    const [rows]: any = await this.pool().execute(
      'SELECT id, order_id, product_id, quantity, price, created_at FROM order_items WHERE order_id = ?',
      [orderId],
    );

    return rows;
  }

  async getAll() {
    const [rows]: any = await this.pool().execute(
      'SELECT id, order_id, product_id, quantity, price, created_at FROM order_items',
    );

    return rows;
  }

  async updateOrderItem(
    id: number,
    partial: {
      order_id?: number;
      product_id?: number;
      quantity?: number;
      price?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }

    if (partial.product_id !== undefined) {
      fields.push('product_id = ?');
      values.push(partial.product_id);
    }

    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }

    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE order_items SET ${fields.join(', ')} WHERE id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteOrderItem(id: number) {
    const [res]: any = await this.pool().execute(
      'DELETE FROM order_items WHERE id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    return res.affectedRows > 0;
  }
}