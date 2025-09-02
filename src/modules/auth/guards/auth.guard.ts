import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new UnauthorizedException(
        'Um tenant precisa ser informado para essa requsição!'
      );
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      /**
       * @todo implementar validação de sessão
       */

      // const isValidSession = await this.authService.validateSession(
      //   payload.username,
      //   payload.code,
      // );

      // if (!isValidSession) {
      //   throw new UnauthorizedException('Invalid Session');
      // }

      request['user'] = payload;
    } catch (error: any) {
      throw new UnauthorizedException(`${error.message}`);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
