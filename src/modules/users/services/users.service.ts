import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * @todo
   * -adicionar metodo create
   * -definir o hash da senha
   * -ajusar auth para usar o typeorm
   */

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updates: Partial<User> = {};

    if (updateUserDto.name) {
      updates.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      const emailExists = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (emailExists) {
        throw new UnauthorizedException('Este email já está em uso');
      }
      updates.email = updateUserDto.email;
    }

    if (updateUserDto.newPassword) {
      if (!updateUserDto.currentPassword) {
        throw new UnauthorizedException(
          'Senha atual é obrigatória para alterar a senha'
        );
      }

      const userWithPassword = await this.usersRepository.findOneBy({
        id,
      });

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        userWithPassword.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Senha atual incorreta');
      }

      updates.password = await this.hashPassword(updateUserDto.newPassword);
    }

    Object.assign(user, updates);

    await this.usersRepository.save(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
