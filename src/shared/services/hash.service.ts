import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export default class HashService {
  public constructor(private readonly config: ConfigService) {}

  public async hash(
    password: string,
    saltRounds: number = Number(this.config.get<number>('SALT_ROUNDS', 8)),
  ): Promise<string> {
    return await hash(password, await genSalt(saltRounds));
  }

  public async compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(plainTextPassword, hashedPassword);
  }
}
