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
import { AuthService } from './auth.service';
import { UserAuthenticationDto } from './dtos/authentication.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = mockUserFactory();

  // Common spy object.
  let spies: { [key: string]: jest.SpyInstance } = {};

  // Clears the spies and resets default mock implementations.
  const resetSpies = () => {
    Object.keys(spies).forEach((spy) => spies[spy].mockClear());
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AuthService,
        UsersService,
        JwtService,
        HashService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    spies = {
      findOneForAuth: jest
        .spyOn(service['usersService'], 'findOneForAuth')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => ({
          id: mockUser.id,
          email: mockUser.email,
          password: mockUser.password,
        })),
      toAccessToken: jest
        .spyOn<any, any>(service, 'toAccessToken')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => mockAuthenticationResponse),
      compare: jest
        .spyOn(service['hash'], 'compare')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => false),
    };
    // console.warn('Service: ', service);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('Method: register', () => {
    it('should hash the users password, call the user services create method and return the access token', async () => {
      const { email } = mockUser;
      const registerDto: UserAuthenticationDto = {
        email,
        password: mockPassword,
      };

      const create = jest
        .spyOn(service['usersService'], 'create')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => mockUser);

      expect(await service.register(registerDto)).toEqual(
        mockAuthenticationResponse,
      );
      expect(create).toHaveBeenCalledWith(registerDto);
      expect(spies.toAccessToken).toHaveBeenCalledWith({
        createdAt: mockUser.createdAt,
        email: mockUser.email,
        id: mockUser.id,
      });
    });
  });

  describe('Method: login', () => {
    const { email } = mockUser;
    const loginDto: UserAuthenticationDto = { email, password: mockPassword };
    resetSpies();

    it('should login a user', async () => {
      // eslint-disable-next-line @typescript-eslint/require-await
      spies.compare.mockImplementationOnce(async () => true);

      expect(await service.login(loginDto)).toEqual(mockAuthenticationResponse);
      expect(spies.findOneForAuth).toHaveBeenCalledWith(email);
      expect(spies.toAccessToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw an unauthorized exception if the user does not exist', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/require-await
        spies.findOneForAuth.mockImplementationOnce(async () => null);
        expect(await service.login(loginDto));
        // The test should not reach here.
        expect(false).toBeTruthy();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        expect(spies.findOneForAuth).toHaveBeenCalledWith(email);
        expect(spies.toAccessToken).not.toHaveBeenCalled();
      }
    });

    it('should throw an unauthorized exception if the hashed and plaintext passwords do not match', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/require-await
        spies.compare.mockImplementationOnce(async () => false);
        expect(await service.login(loginDto));
        // The test should not reach here.
        expect(false).toBeTruthy();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        expect(spies.findOneForAuth).toHaveBeenCalledWith(email);
        expect(spies.toAccessToken).not.toHaveBeenCalled();
      }
    });
  });

  describe('Method: toAccessToken', () => {
    it('should call the jwt services signAsync method with the user object and return the access token', async () => {
      spies.toAccessToken.mockRestore();
      const signAsync = jest
        .spyOn(service['jwtService'], 'signAsync')
        .mockImplementation(
          // eslint-disable-next-line @typescript-eslint/require-await
          async () => mockAuthenticationResponse.access_token,
        );
      const { id } = mockUser;

      expect(await service['toAccessToken'](mockUser)).toEqual(
        mockAuthenticationResponse,
      );
      expect(signAsync).toHaveBeenCalledWith({
        sub: id,
        id,
      });
    });
  });
});
