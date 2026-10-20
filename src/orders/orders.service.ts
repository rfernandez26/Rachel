import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(userId: number, addressId: number, totalAmount: number, items: { itemName: string; quantity: number; price: number }[]) {
    const connection = await this.pool();
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // Insert Order
      const [orderResult] = await conn.execute<OkPacket>(
        'INSERT INTO orders (user_id, address_id, total_amount, status) VALUES (?, ?, ?, ?)',
        [userId, addressId || null, totalAmount, 'pending']
      );
      const orderId = orderResult.insertId;

      // Insert Order Items
      for (const item of items) {
        await conn.execute<OkPacket>(
          'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.itemName, item.quantity, item.price]
        );
      }

      await conn.commit();
      conn.release();

      return { order_id: orderId, userId, addressId, totalAmount, status: 'pending', items };
    } catch (error) {
      await conn.rollback();
      conn.release();
      throw error;
    }
  }

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id AS id, user_id, address_id, total_amount, status, created_at FROM orders'
    );
    return rows;
  }

  async findById(id: number) {
    const [orderRows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id AS id, user_id, address_id, total_amount, status, created_at FROM orders WHERE order_id = ?',
      [id]
    );
    if (!orderRows[0]) throw new NotFoundException(`Order with ID ${id} not found`);

    const [itemRows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id AS id, item_name, quantity, price FROM order_items WHERE order_id = ?',
      [id]
    );

    return {
      ...orderRows[0],
      items: itemRows,
    };
  }

  async updateStatus(id: number, status: string) {
    const [res] = await this.pool().execute<OkPacket>(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, id]
    );
    if (res.affectedRows === 0) throw new NotFoundException(`Order with ID ${id} not found`);
    return this.findById(id);
  }

  async deleteOrder(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}