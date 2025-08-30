import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDTO } from './create-sale.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { SaleStatus } from '../entities/sale.entity';

export class UpdateSaleDto extends PartialType(CreateSaleDTO) {
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;
}
