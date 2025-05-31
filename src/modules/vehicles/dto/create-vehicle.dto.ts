import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  plate?: string;
}
