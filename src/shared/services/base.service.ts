import { HttpException, InternalServerErrorException } from '@nestjs/common';

export default abstract class BaseService {
  protected throwError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new InternalServerErrorException();
    }
  }
}
