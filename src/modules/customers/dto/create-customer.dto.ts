import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDTO {
  @ApiProperty({ description: 'Nome completo do cliente' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'CPF ou CNPJ do cliente' })
  @IsString()
  cpf_cnpj: string;

  @ApiProperty({ description: 'Email do cliente' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefone do cliente' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Endereço completo', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Cidade', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Estado', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'CEP', required: false })
  @IsOptional()
  @IsString()
  zip_code?: string;
}
