import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CustomersService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createCustomer(
    name: string,
    email: string,
    phone: string = '',
    address: string = '',
  ) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address],
    );

    return { id: result.insertId, name, email, phone, address };
  }

  async findById(id: number) {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, email, phone, address, created_at FROM customers WHERE id = ?',
      [id],
    );

    if (!rows[0]) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return rows[0];
  }

  async getAll() {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, email, phone, address, created_at FROM customers',
    );

    return rows;
  }

  async updateCustomer(
    id: number,
    partial: { name?: string; email?: string; phone?: string; address?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }

    if (partial.email) {
      fields.push('email = ?');
      values.push(partial.email);
    }

    if (partial.phone) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }

    if (partial.address) {
      fields.push('address = ?');
      values.push(partial.address);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteCustomer(id: number) {
    const [res]: any = await this.pool().execute(
      'DELETE FROM customers WHERE id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return res.affectedRows > 0;
  }
}