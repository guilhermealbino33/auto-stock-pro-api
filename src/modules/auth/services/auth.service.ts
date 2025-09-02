import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from '../dto/sign-in.dto';
import { CryptService } from './crypt.service';
import {
  RequestUserInterface,
  SingInResponseInterface,
} from '../interfaces/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private cryptService: CryptService
  ) {}

  async signIn({
    username,
    password,
  }: SignInDTO): Promise<SingInResponseInterface> {
    const user = await this.usersRepository.findOne({
      select: ['id', 'password', 'email', 'name', 'role', 'is_active'],
      where: { email: username.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    const isMatch = await this.cryptService.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      name: user.name,
      username: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }

  async signOut(): Promise<void> {
    /**
     * @todo
     *
     * ajustar para invalidar token ou algo do tipo
     */
  }

  async getProfile(requestUser: RequestUserInterface) {
    const { url_profile_picture } = requestUser;

    return {
      ...requestUser,
      url_profile_picture,
    };
  }
}
