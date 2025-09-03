import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  interface MakeSutTypes {
    controller: AuthController;
    authService: AuthService;
  }

  const makeSut = (): MakeSutTypes => {
    const authService = {} as jest.Mocked<AuthService>;

    const controller = new AuthController(authService);

    return {
      controller,
      authService,
    };
  };

  it('should be defined', () => {
    const { controller } = makeSut();

    expect(controller).toBeDefined();
  });
});
