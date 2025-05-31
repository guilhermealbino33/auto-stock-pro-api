import { Injectable } from '@nestjs/common';
import { ForgotPasswordDTO, LoginDTO, RegisterDTO } from './dto';
import {
  createUser,
  authenticateUser,
  generateToken,
  verifyToken,
} from '@/lib/auth';
import { sql } from '@/lib/database'; // importando o client neon direto

@Injectable()
export class AuthService {
  // Remove o db do construtor, não precisa mais
  // constructor(private readonly db: DatabaseService) {}

  async forgotPassword(dto: ForgotPasswordDTO) {
    const result =
      await sql`SELECT id, email, name FROM users WHERE email = ${dto.email}`;

    if (result.length > 0) {
      console.log(`Email de recuperação seria enviado para: ${dto.email}`);
    }

    return {
      message:
        'Se o email estiver cadastrado, você receberá as instruções de recuperação.',
    };
  }

  async login(dto: LoginDTO) {
    const user = await authenticateUser(dto.email, dto.password);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    const token = await generateToken(user);
    return { user, token };
  }

  async register(dto: RegisterDTO) {
    if (dto.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const user = await createUser(dto.email, dto.password, dto.name);
    const token = await generateToken(user);

    return { user, token };
  }

  async verify(authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Token não fornecido');
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      throw new Error('Token inválido');
    }

    const result =
      await sql`SELECT id, email, name, role FROM users WHERE id = ${decoded.userId}`;

    if (result.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    return { user: result[0] };
  }
}
