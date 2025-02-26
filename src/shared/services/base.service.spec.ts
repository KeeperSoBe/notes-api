import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import BaseService from './base.service';

describe('BaseService', () => {
  class MockService extends BaseService {}

  const service = new MockService();

  it('should be defined', () => expect(service).toBeDefined());

  describe('Method: throwError', () => {
    it('should throw a given exception', () => {
      try {
        service['throwError'](new NotFoundException());
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw an internal server exception if given a generic error', () => {
      try {
        service['throwError'](new Error());
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
