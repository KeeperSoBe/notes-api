import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import HashService from './hash.service';

describe('HashService', () => {
  let service: HashService;

  const mockSalt = 'mock-salt';
  const mockPassword = 'mock-password';
  const mockHashedPassword = 'mock-hashed-password';

  // Common spy object.
  let spies: { [key: string]: jest.SpyInstance | null } = {
    compare: null,
    genSalt: null,
    hash: null,
  };

  // Clears the spies and resets default mock implementations.
  const resetSpies = () => {
    spies = {
      compare: jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
        .mockImplementation(async () => true),
      genSalt: jest
        .spyOn(bcrypt, 'genSalt')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
        .mockImplementation(async () => mockSalt),
      hash: jest
        .spyOn(bcrypt, 'hash')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
        .mockImplementation(async () => mockHashedPassword),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);

    resetSpies();
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('Method: hash', () => {
    it('should hash a given password', async () => {
      expect(await service.hash(mockPassword)).toBe(mockHashedPassword);
      expect(spies.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      expect(spies.genSalt).toHaveBeenCalledWith(8);
    });
  });

  describe('Method: compare', () => {
    it('should compare a plain text and hashed password', async () => {
      expect(await service.compare(mockHashedPassword, mockPassword)).toBe(
        true,
      );
    });
  });
});
