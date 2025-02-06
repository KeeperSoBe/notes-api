/**
 * Swagger cant parse nests exceptions, as these are often returned to the client
 * we define them here as class stubs for use in controller response decorators.
 *
 * Ex: @ApiUnauthorizedResponse({ type: IUnauthorizedException })
 */

'use strict';

import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const messageDescription = 'The exceptions message.';
const statusDescription = 'The exceptions status code.';

const HttpException: { [key: number]: string } = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request Exception',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized Exception',
  [HttpStatus.NOT_FOUND]: 'Not Found Exception',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Exception',
};

const ApiMessageProperty = (status: number) => ({
  type: String,
  description: messageDescription,
  default: HttpException[status],
});

const ApiStatusProperty = (status: number) => ({
  type: Number,
  description: statusDescription,
  default: status,
});

abstract class IException {
  public readonly message: string;

  public readonly statusCode: number;
}

export abstract class IBadRequestException extends IException {
  @ApiProperty(ApiMessageProperty(400))
  public readonly message: string;

  @ApiProperty(ApiStatusProperty(400))
  public readonly statusCode: number;
}

export abstract class IUnauthorizedException extends IException {
  @ApiProperty(ApiMessageProperty(401))
  public readonly message: string;

  @ApiProperty(ApiStatusProperty(401))
  public readonly statusCode: number;
}

export abstract class INotFoundException extends IException {
  @ApiProperty(ApiMessageProperty(404))
  public readonly message: string;

  @ApiProperty(ApiStatusProperty(404))
  public readonly statusCode: number;
}
