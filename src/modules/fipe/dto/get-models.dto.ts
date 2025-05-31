import { IsString, IsNotEmpty } from 'class-validator';

export class GetModelsDTO {
  @IsString()
  @IsNotEmpty({ message: 'Código da marca é obrigatório' })
  brand: string;
}
