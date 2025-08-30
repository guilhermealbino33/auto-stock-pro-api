import { ApiProperty } from '@nestjs/swagger';

/**
 * @todo converter para etidade do typeorm
 */

export class User {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Data de criação do usuário' })
  created_at: Date;

  @ApiProperty({ description: 'Data da última atualização do usuário' })
  updated_at: Date;

  password?: string;
}
