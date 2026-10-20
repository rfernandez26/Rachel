import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createEmployee(
    name: string,
    position: string,
    department: string = '',
    salary: number = 0,
  ) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)',
      [name, position, department, salary],
    );

    return { id: result.insertId, name, position, department, salary };
  }

  async findById(id: number) {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, position, department, salary, created_at FROM employees WHERE id = ?',
      [id],
    );

    if (!rows[0]) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return rows[0];
  }

  async getAll() {
    const [rows]: any = await this.pool().execute(
      'SELECT id, name, position, department, salary, created_at FROM employees',
    );

    return rows;
  }

  async updateEmployee(
    id: number,
    partial: {
      name?: string;
      position?: string;
      department?: string;
      salary?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }

    if (partial.position) {
      fields.push('position = ?');
      values.push(partial.position);
    }

    if (partial.department) {
      fields.push('department = ?');
      values.push(partial.department);
    }

    if (partial.salary !== undefined) {
      fields.push('salary = ?');
      values.push(partial.salary);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteEmployee(id: number) {
    const [res]: any = await this.pool().execute(
      'DELETE FROM employees WHERE id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return res.affectedRows > 0;
  }
}