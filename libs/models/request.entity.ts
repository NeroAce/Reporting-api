import { IsOptional } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  status: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  query: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  message: string;

  @Column()
  date: string;

  @Column()
  time: string;
}
