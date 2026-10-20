import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthorsService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createAuthor(name: string, bio: string = '', email: string = '') {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO authors (name, bio, email) VALUES (?, ?, ?)',
      [name, bio, email],
    );

    return { id: result.insertId, name, bio, email };
  }

  async findById(id: number) {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, bio, email, created_at FROM authors WHERE id = ?',
      [id],
    );

    if (!rows[0]) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return rows[0];
  }

  async getAll() {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, bio, email, created_at FROM authors',
    );

    return rows;
  }

  async updateAuthor(
    id: number,
    partial: { name?: string; bio?: string; email?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }

    if (partial.bio) {
      fields.push('bio = ?');
      values.push(partial.bio);
    }

    if (partial.email) {
      fields.push('email = ?');
      values.push(partial.email);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE authors SET ${fields.join(', ')} WHERE id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteAuthor(id: number) {
    const [res]: any = await this.pool().execute(
      'DELETE FROM authors WHERE id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return res.affectedRows > 0;
  }
}