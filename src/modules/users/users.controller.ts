import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Excluir conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta excluída com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async removeProfile(@Request() req): Promise<void> {
    return this.usersService.remove(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter usuário por ID (apenas para administradores)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
