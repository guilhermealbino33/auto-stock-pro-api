import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { VehicleStatusEnum, VehicleTypeEnum } from '../enums/vehicle.enum';

export class CreateVehicleDTO {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsOptional()
  year_model: number;

  @IsNumber()
  price: number;

  @IsOptional()
  price_fipe: number;

  @IsOptional()
  price_fipe_date: Date;

  @IsOptional()
  mileage: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(VehicleTypeEnum)
  type?: string;

  @IsOptional()
  @IsEnum(VehicleStatusEnum)
  status?: string;

  @IsOptional()
  @IsString()
  plate?: string;
}
