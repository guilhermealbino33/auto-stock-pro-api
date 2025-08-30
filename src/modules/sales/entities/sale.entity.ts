import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Vehicle } from '@/modules/vehicles/entities/vehicle.entity';
import { User } from '@/modules/users';
import { BaseEntity } from '@/modules/common/infra/entities/base-entity';
import { SalePaymentMethodEnum, SaleStatusEnum } from '../enums/sales.enum';

@Entity('sales')
export class Sale extends BaseEntity {
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.sales)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column()
  vehicle_id: number;

  @Column({ nullable: true })
  trade_in_vehicle_id: number;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  agreed_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  trade_in_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  profit_projection: number;

  @Column({
    default: SaleStatusEnum.NEGOCIANDO,
  })
  status: string;

  @Column({
    default: SalePaymentMethodEnum.OUTRO,
  })
  payment_method: string;

  @Column({ nullable: true })
  notes: string;

  /**
   * @todo
   * analisar questão de action history
   */

  @ManyToOne(() => User, (user) => user.sales)
  user: User;
}
