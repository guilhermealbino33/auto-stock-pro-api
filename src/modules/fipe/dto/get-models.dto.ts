import { IsString, IsNotEmpty } from 'class-validator';

export class GetModelsDto {
  @IsString()
  @IsNotEmpty({ message: 'Código da marca é obrigatório' })
  brand: string;
}
