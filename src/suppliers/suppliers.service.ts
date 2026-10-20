import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SuppliersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createSupplier(name: string, contactPerson?: string, phone?: string, email?: string, address?: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [name, contactPerson || null, phone || null, email || null, address || null]
    );
    return {
      supplier_id: result.insertId,
      name,
      contact_person: contactPerson,
      phone,
      email,
      address,
    };
  }

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT supplier_id AS id, name, contact_person, phone, email, address, created_at FROM suppliers'
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT supplier_id AS id, name, contact_person, phone, email, address, created_at FROM suppliers WHERE supplier_id = ?',
      [id]
    );
    if (!rows[0]) throw new NotFoundException(`Supplier with ID ${id} not found`);
    return rows[0];
  }

  async updateSupplier(id: number, partial: { name?: string; contact_person?: string; phone?: string; email?: string; address?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }
    if (partial.contact_person !== undefined) {
      fields.push('contact_person = ?');
      values.push(partial.contact_person);
    }
    if (partial.phone !== undefined) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }
    if (partial.email !== undefined) {
      fields.push('email = ?');
      values.push(partial.email);
    }
    if (partial.address !== undefined) {
      fields.push('address = ?');
      values.push(partial.address);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE suppliers SET ${fields.join(', ')} WHERE supplier_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteSupplier(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM suppliers WHERE supplier_id = ?',
      [id]
    );
    if (res.affectedRows === 0) throw new NotFoundException(`Supplier with ID ${id} not found`);
    return { success: true, message: `Supplier with ID ${id} deleted successfully` };
  }
}