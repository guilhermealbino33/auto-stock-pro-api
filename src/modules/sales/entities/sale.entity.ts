import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
// import { User } from '../../users/entities/user.entity';
import { Vehicle } from '@/modules/vehicles/entities/vehicle.entity';

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.sales)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column()
  vehicle_id: number;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: number;

  // @ManyToOne(() => Vehicle, (vehicle) => vehicle.trade_in_sales, {
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'trade_in_vehicle_id' })
  // trade_in_vehicle: Vehicle;

  @Column({ nullable: true })
  trade_in_vehicle_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  agreed_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  trade_in_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  profit_projection: number;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  status: SaleStatus;

  @Column({ nullable: true })
  notes: string;

  /**
   * @todo
   * analisar questão de action history
   */

  // @ManyToOne(() => User, (user) => user.sales)
  // @JoinColumn({ name: 'created_by_id' })
  // created_by: User;

  @Column()
  created_by_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
