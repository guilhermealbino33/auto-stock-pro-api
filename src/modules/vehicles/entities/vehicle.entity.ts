import {
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Sale } from '@/modules/sales/entities/sale.entity';
import { VehicleStatusEnum } from '../enums/vehicle.enum';

export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  year_model: number;

  @Column()
  price: number;

  @Column()
  price_fipe: number;

  @Column()
  price_fipe_date: Date;

  @Column()
  mileage: number;

  @Column({ nullable: true })
  color?: string;

  @Column()
  plate?: string;

  @Column({ default: VehicleStatusEnum.DISPONIVEL })
  status: string;

  @OneToMany(() => Sale, (sale) => sale.vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
