import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(orderId: number, amount: number, paymentMethod: string, status = 'completed') {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payments (order_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
      [orderId, amount, paymentMethod, status]
    );
    return {
      payment_id: result.insertId,
      order_id: orderId,
      amount,
      payment_method: paymentMethod,
      status,
    };
  }

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id AS id, order_id, amount, payment_method, status, created_at FROM payments'
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id AS id, order_id, amount, payment_method, status, created_at FROM payments WHERE payment_id = ?',
      [id]
    );
    if (!rows[0]) throw new NotFoundException(`Payment with ID ${id} not found`);
    return rows[0];
  }

  async findByOrderId(orderId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id AS id, order_id, amount, payment_method, status, created_at FROM payments WHERE order_id = ?',
      [orderId]
    );
    return rows;
  }

  async updateStatus(id: number, status: string) {
    const [res] = await this.pool().execute<OkPacket>(
      'UPDATE payments SET status = ? WHERE payment_id = ?',
      [status, id]
    );
    if (res.affectedRows === 0) throw new NotFoundException(`Payment with ID ${id} not found`);
    return this.findById(id);
  }

  async deletePayment(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM payments WHERE payment_id = ?',
      [id]
    );
    return res.affectedRows > 0;
  }
}