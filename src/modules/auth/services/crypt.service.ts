import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../constants/auth.constants';

@Injectable()
export class CryptService {
  async compare(password: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(password, encrypted);
  }

  async hash(password: string): Promise<string> {
    const salt = jwtConstants.SALT;

    return bcrypt.hash(password, salt);
  }
}
