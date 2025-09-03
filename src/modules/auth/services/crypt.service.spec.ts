import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CryptService } from './crypt.service';
import { jwtConstants } from '../constants/auth.constants';

// Mock bcrypt module
jest.mock('bcrypt');

interface MakeSutTypes {
  cryptService: CryptService;
}

const makeSut = (): MakeSutTypes => {
  const cryptService = new CryptService();

  return {
    cryptService,
  };
};

describe('CryptService', () => {
  describe('compare', () => {
    it('should return true if comparison succeeds', async () => {
      const { cryptService } = makeSut();

      const bcryptCompareMock = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      const result = await cryptService.compare('password', 'hashedPassword');

      expect(result).toEqual(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(
        'password',
        'hashedPassword'
      );
    });

    it('should return true when passwords match', async () => {
      const { cryptService } = makeSut();

      const bcryptCompareMock = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      const result = await cryptService.compare('password', 'hashedPassword');

      expect(result).toEqual(true);
      expect(bcryptCompareMock).toHaveBeenCalledWith(
        'password',
        'hashedPassword'
      );
    });

    it('should return false when passwords do not match', async () => {
      const { cryptService } = makeSut();

      const bcryptCompareMock = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => false);

      const result = await cryptService.compare(
        'wrong-password',
        'hashedPassword'
      );

      expect(result).toEqual(false);
      expect(bcryptCompareMock).toHaveBeenCalledWith(
        'wrong-password',
        'hashedPassword'
      );
    });
  });

  describe('hash', () => {
    it('should call bcrypt.hash with correct parameters', async () => {
      const { cryptService } = makeSut();

      const password = 'test-password';

      expect(cryptService.hash(password)).toHaveBeenCalledTimes(1);
      expect(cryptService.hash(password)).toHaveBeenCalledWith(
        password,
        jwtConstants.SALT
      );
    });

    it('should return  hashed password', async () => {
      const { cryptService } = makeSut();

      const bcryptHashMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => {
          return 'hashedPassword';
        });

      const result = await cryptService.hash('password');

      expect(result).toEqual('hashedPassword');
      expect(bcryptHashMock).toHaveBeenCalledWith(
        'password',
        jwtConstants.SALT
      );
    });
  });
});
