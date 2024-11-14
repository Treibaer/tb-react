import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const authDto: AuthDto = { username: 'test', password: 'test', email: 'test', client: 'test' };
      await controller.signIn(authDto);
      expect(authService.signIn).toHaveBeenCalledWith(authDto);
    });
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const authDto: AuthDto = { username: 'test', password: 'test', email: 'test', client: 'test' };
      await controller.register(authDto);
      expect(authService.register).toHaveBeenCalledWith(authDto);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const authDto: AuthDto = { username: 'test', password: 'test', email: 'test', client: 'test', confirmPassword: 'test2' };
      await expect(controller.register(authDto)).rejects.toThrow(BadRequestException);
    });
  });
});
