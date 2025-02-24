import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import HashService from '../../shared/hash.service';
import { UserDto } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthenticationResponse } from './auth.interface';
import { UserAuthenticationDto } from './dtos/authentication.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hash: HashService,
  ) {}

  public async register({
    password,
    ...rest
  }: UserAuthenticationDto): Promise<AuthenticationResponse> {
    return await this.toAccessToken(
      await this.usersService.create({
        ...rest,
        password,
      }),
    );
  }

  public async login(
    loginDto: UserAuthenticationDto,
  ): Promise<AuthenticationResponse> {
    const { password, ...user } = await this.usersService.findOneForAuth(
      loginDto.email,
    );

    if (!user || !(await this.hash.compare(loginDto.password, password))) {
      throw new UnauthorizedException();
    }

    return await this.toAccessToken(user as UserDto);
  }

  private async toAccessToken({
    id,
  }: UserDto): Promise<AuthenticationResponse> {
    return {
      access_token: await this.jwtService.signAsync({
        sub: id,
        id,
      }),
    };
  }
}
