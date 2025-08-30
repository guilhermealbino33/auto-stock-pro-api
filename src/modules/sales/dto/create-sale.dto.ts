import {
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { SalePaymentMethodEnum } from '../enums/sales.enum';

export class CreateSaleDTO {
  @IsNumber()
  vehicle_id: number;

  @IsNumber()
  customer_id: number;

  @IsOptional()
  @IsString()
  trade_in_vehicle_plate?: string;

  /**
   * @todo
   * analisar se deverá ter um create vehicle para veículo de troca
   * e como isso funcionaria para caso o veículo já tivesse passado pela revenda
   */

  @IsNumber()
  @IsPositive()
  agreed_price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  trade_in_value?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(SalePaymentMethodEnum)
  payment_method?: string;
}
