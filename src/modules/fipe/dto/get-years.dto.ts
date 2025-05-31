import { IsString, IsNotEmpty } from 'class-validator';

export class GetYearsDto {
  @IsString()
  @IsNotEmpty({ message: 'Código da marca é obrigatório' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'Código do modelo é obrigatório' })
  model: string;
}
