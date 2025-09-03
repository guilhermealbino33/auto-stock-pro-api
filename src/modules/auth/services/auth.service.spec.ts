import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SignInDTO } from '../dto/sign-in.dto';
import { User } from '@/modules/users';
import { UserRoleEnum } from '@/modules/users/enums/user.enum';
import { CryptService } from './crypt.service';
import { AuthService } from './auth.service';
import { RequestUserInterface } from '../interfaces/auth.interface';

interface MakeSutTypes {
  sut: AuthService;
  usersRepository: jest.Mocked<Repository<User>>;
  jwtService: jest.Mocked<JwtService>;
  cryptService: jest.Mocked<CryptService>;
}

const makeSut = async (): Promise<MakeSutTypes> => {
  const usersRepository = {
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;

  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  const cryptService = {
    compare: jest.fn(),
  } as unknown as jest.Mocked<CryptService>;

  const sut = new AuthService(
    usersRepository as jest.Mocked<Repository<User>>,
    jwtService as jest.Mocked<JwtService>,
    cryptService as jest.Mocked<CryptService>
  );

  return {
    sut,
    usersRepository,
    jwtService,
    cryptService,
  };
};

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashed-password',
  name: 'Test User',
  is_active: true,
  role: UserRoleEnum.ADMIN,
  created_at: new Date(),
  updated_at: new Date(),
} as User;

describe('AuthService', () => {
  describe('signIn', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      const { sut, usersRepository } = await makeSut();
      const signInData: SignInDTO = {
        email: 'nonexistent@example.com',
        password: 'any-password',
      };

      usersRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(sut.signIn(signInData)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const { sut, usersRepository } = await makeSut();
      const signInData: SignInDTO = {
        email: 'inactive@example.com',
        password: 'any-password',
      };

      usersRepository.findOne.mockResolvedValueOnce({
        ...mockUser,
        is_active: false,
      });

      await expect(sut.signIn(signInData)).rejects.toThrow('Usuário inativo.');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const { sut, usersRepository, cryptService } = await makeSut();
      const signInData: SignInDTO = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      usersRepository.findOne.mockResolvedValueOnce(mockUser);
      cryptService.compare.mockResolvedValueOnce(false);

      await expect(sut.signIn(signInData)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should return access token and role when credentials are valid', async () => {
      const { sut, usersRepository, jwtService } = await makeSut();
      const signInData: SignInDTO = {
        email: 'test@example.com',
        password: 'correct-password',
      };

      usersRepository.findOne.mockResolvedValueOnce(mockUser);
      jwtService.signAsync.mockResolvedValueOnce('mocked-jwt-token');

      const result = await sut.signIn(signInData);

      expect(result).toHaveProperty('accessToken', 'mocked-jwt-token');
      expect(result).toHaveProperty('role', mockUser.role);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        name: mockUser.name,
        username: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException when user is not found or inactive', async () => {
      const { sut, usersRepository } = await makeSut();
      const userId = 999; // Non-existent user ID

      usersRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(sut.refreshToken(userId)).rejects.toThrow(
        'Usuário não encontrado ou inativo'
      );
    });

    it('should return new access token and refresh token', async () => {
      const { sut, usersRepository, jwtService } = await makeSut();
      usersRepository.findOne.mockResolvedValueOnce(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await sut.refreshToken(mockUser.id);

      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile with profile picture URL', async () => {
      const { sut } = await makeSut();
      const mockRequestUser = {
        sub: 1,
        name: 'Test User',
        username: 'test@example.com',
        role: UserRoleEnum.ADMIN,
        code: 'test-code',
        url_profile_picture: 'http://example.com/profile.jpg',
      } as unknown as RequestUserInterface;

      const result = await sut.getProfile(mockRequestUser);

      expect(result).toBe(mockRequestUser);
    });
  });
});
