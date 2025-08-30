import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDTO } from './create-sale.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { SalePaymentMethodEnum, SaleStatusEnum } from '../enums/sales.enum';

export class UpdateSaleDto extends PartialType(CreateSaleDTO) {
  @IsOptional()
  @IsEnum(SaleStatusEnum)
  status?: SaleStatusEnum;

  @IsOptional()
  @IsEnum(SalePaymentMethodEnum)
  payment_method?: SalePaymentMethodEnum;
}
