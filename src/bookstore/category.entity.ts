import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  category_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;
}