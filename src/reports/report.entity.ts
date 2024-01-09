import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  price: number;
}
