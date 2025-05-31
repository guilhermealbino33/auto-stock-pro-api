import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { verifyToken } from '@/lib/auth'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader) throw new UnauthorizedException('Token não fornecido')

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) throw new UnauthorizedException('Token inválido')

    request.user = decoded
    return true
  }
}
