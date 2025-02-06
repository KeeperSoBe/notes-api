import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

const USER_PASSWORD_MIN_LEN = 7;
const USER_PASSWORD_MAX_LEN = 64;

export class AuthenticationCredentials {
  public readonly email: string;
  public readonly password: string;
}

export class UserAuthenticationDto implements AuthenticationCredentials {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The users email address.',
    example: 'dave@test.com',
  })
  public readonly email: string;

  @Length(USER_PASSWORD_MIN_LEN, USER_PASSWORD_MAX_LEN)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The users plaintext password.',
    example: 'Password123',
  })
  public readonly password: string;
}
