import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { mockPassword } from '../../../test/mocks/auth.mock';
import { mockUserFactory } from '../../../test/mocks/user.mock';
import HashService from '../../shared/hash.service';
import { UserAuthenticationDto } from '../auth/dtos/authentication.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = mockUserFactory();
  const mockHashedPassword = 'mock-hashed-password';

  // Common spy object.
  let spies: { [key: string]: jest.SpyInstance | null } = {
    create: null,
    findOne: null,
    hash: null,
  };

  // Clears the spies and resets default mock implementations.
  const resetSpies = () => {
    spies = {
      create: jest
        .spyOn(service['users'], 'create')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => ({ toJSON: () => mockUser }) as never),
      findOne: jest.spyOn(service['users'], 'findOne').mockImplementation(
        () =>
          ({
            select: () => ({
              // eslint-disable-next-line @typescript-eslint/require-await
              lean: async () => mockUser,
            }),
          }) as never,
      ),
      hash: jest
        .spyOn(service['hashService'], 'hash')
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => mockHashedPassword),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UsersService,
        HashService,

        {
          provide: getModelToken(User.name),
          useValue: {
            create: () => {},
            findOne: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    resetSpies();
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('Method: create', () => {
    const { email } = mockUser;
    const registerDto: UserAuthenticationDto = {
      email,
      password: mockPassword,
    };

    it('should create and return a new user', async () => {
      expect(await service.create(registerDto)).toEqual(mockUser);
      expect(spies.create).toHaveBeenCalledWith({
        ...registerDto,
        password: mockHashedPassword,
      });
    });

    it('should throw a bad request exception if the users email is already registered', async () => {
      // eslint-disable-next-line @typescript-eslint/require-await
      spies.create?.mockImplementation(async () => {
        throw new Error();
      });

      try {
        await service.create(registerDto);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    describe('Method: findOneForAuth', () => {
      const { email } = mockUser;

      it('should return the found user', async () => {
        expect(await service.findOneForAuth(email)).toEqual({
          id: mockUser.id,
          email: mockUser.email,
          password: mockUser.password,
        });
        expect(spies.findOne).toHaveBeenCalledWith({
          email,
        });
      });

      it('should throw an unauthorized exception if the user is not found', async () => {
        spies.findOne?.mockImplementationOnce(
          () =>
            ({
              select: () => ({
                // eslint-disable-next-line @typescript-eslint/require-await
                lean: async () => null,
              }),
            }) as never,
        );

        try {
          await service.findOneForAuth(email);
          expect(false).toBeTruthy();
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
  });
});
