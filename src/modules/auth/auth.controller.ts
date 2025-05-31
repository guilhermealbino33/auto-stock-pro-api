import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO, LoginDTO, RegisterDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    try {
      return await this.authService.forgotPassword(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      const status = error.message === 'Credenciais inválidas' ? 401 : 500;
      throw new HttpException(error.message, status);
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      const status = error.message.includes('em uso') ? 409 : 500;
      throw new HttpException(error.message, status);
    }
  }

  @Get('verify')
  async verify(@Headers('authorization') authHeader?: string) {
    try {
      return await this.authService.verify(authHeader);
    } catch (error) {
      const status = error.message.includes('Token')
        ? 401
        : error.message.includes('Usuário')
          ? 404
          : 500;
      throw new HttpException(error.message, status);
    }
  }
}
