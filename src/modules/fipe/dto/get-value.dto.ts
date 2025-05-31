import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetValueDto {
  @IsString()
  @IsNotEmpty({ message: 'Código da marca é obrigatório' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'Código do modelo é obrigatório' })
  model: string;

  @IsString()
  @IsNotEmpty({ message: 'Código do ano é obrigatório' })
  year: string;

  @IsString()
  @IsOptional()
  brandName?: string;

  @IsString()
  @IsOptional()
  modelName?: string;
}
