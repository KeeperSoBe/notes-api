import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  mockAuthenticationResponse,
  mockPassword,
} from '../../../test/mocks/auth.mock';
import { mockUserFactory } from '../../../test/mocks/user.mock';
import HashService from '../../shared/hash.service';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuthenticationDto } from './dtos/authentication.dto';
import { AuthenticatedRequest } from '../../shared/interfaces/request.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = mockUserFactory();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        AuthService,
        HashService,
        UsersService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('should call the auth services register method', async () => {
    const { email } = mockUser;

    const registerDto: UserAuthenticationDto = {
      email,
      password: mockPassword,
    };

    const register = jest
      .spyOn(service, 'register')
      // eslint-disable-next-line @typescript-eslint/require-await
      .mockImplementation(async () => mockAuthenticationResponse);

    expect(await controller.register(registerDto)).toEqual(
      mockAuthenticationResponse,
    );
    expect(register).toHaveBeenCalledWith({
      email: mockUser.email,
      password: mockPassword,
    });
  });

  it('should call the auth services login method', async () => {
    const { email } = mockUser;
    const loginDto: UserAuthenticationDto = {
      email,
      password: mockPassword,
    };

    const login = jest
      .spyOn(service, 'login')
      // eslint-disable-next-line @typescript-eslint/require-await
      .mockImplementation(async () => mockAuthenticationResponse);

    expect(await controller.login(loginDto)).toEqual(
      mockAuthenticationResponse,
    );
    expect(login).toHaveBeenCalledWith({
      email: mockUser.email,
      password: mockPassword,
    });
  });

  it('should return the currently authenticated user', () =>
    expect(controller.me({ user: mockUser } as AuthenticatedRequest)).toBe(
      mockUser,
    ));
});
