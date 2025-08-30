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

import { AuthGuard } from '../../auth/guards/auth.guard';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDTO
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete('profile')
  async removeProfile(@Request() req): Promise<void> {
    return this.usersService.remove(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
}
