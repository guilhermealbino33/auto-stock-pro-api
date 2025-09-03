import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { SignInDTO } from '../dto/sign-in.dto';
// import { SignOutDTO } from '../dto/sign-out.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signIn: SignInDTO) {
    return this.authService.signIn(signIn);
  }

  // @Post('logout')
  // signOut(@Body() signOut: SignOutDTO) {
  //   return this.authService.signOut(signOut);
  // }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
