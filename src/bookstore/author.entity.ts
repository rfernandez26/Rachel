import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  author_id!: number;

  @Column({ type: 'varchar', length: 50 })
  first_name!: string;

  @Column({ type: 'varchar', length: 50 })
  last_name!: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email!: string;
}