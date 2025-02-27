import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthenticatedRequest } from '../../shared/interfaces/request.interface';
import {
  IBadRequestException,
  IInternalServerErrorException,
  IUnauthorizedException,
} from '../../shared/interfaces/swagger.interface';
import { UserDto } from '../users/user.schema';
import { AuthenticationResponse } from './auth.interface';
import { AuthService } from './auth.service';
import { Public } from './decorators/is-public.decorator';
import { UserAuthenticationDto } from './dtos/authentication.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
@ApiInternalServerErrorResponse({ type: IInternalServerErrorException })
@Throttle({
  default: {
    ttl: 60,
    limit: 10,
  },
})
export class AuthController {
  public constructor(private readonly service: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({
    operationId: 'register',
    summary: 'Register a user',
    description: 'Registers a new user.',
  })
  @ApiBody({ type: UserAuthenticationDto })
  @ApiCreatedResponse({ type: AuthenticationResponse })
  @ApiBadRequestResponse({ type: IBadRequestException })
  public async register(
    @Body() { email, password }: UserAuthenticationDto,
  ): Promise<AuthenticationResponse> {
    return this.service.register({
      email,
      password,
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Log in a user',
    description: 'Logs in an existing user.',
  })
  @ApiBody({ type: UserAuthenticationDto })
  @ApiOkResponse({ type: AuthenticationResponse })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async login(
    @Body() { email, password }: UserAuthenticationDto,
  ): Promise<AuthenticationResponse> {
    return this.service.login({
      email,
      password,
    });
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'me',
    summary: 'Get the authenticated user',
    description: 'Returns the currently authenticated user.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public me(@Request() { user }: AuthenticatedRequest): UserDto {
    return user;
  }
}
