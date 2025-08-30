import { Column, Entity, OneToMany } from 'typeorm';

import { Sale } from '@/modules/sales/entities/sale.entity';
import { BaseEntity } from '@/modules/common/infra/entities/base-entity';
import { UserRoleEnum } from '@/modules/users/enums/user.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  active: boolean;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: UserRoleEnum.VENDEDOR,
  })
  role: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  cpf?: string;

  @OneToMany(() => Sale, (sale) => sale.created_by_id)
  sales?: Sale[];
}
