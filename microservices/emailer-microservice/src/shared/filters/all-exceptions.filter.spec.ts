import { HttpException, HttpStatus } from '@nestjs/common';

import { ConflictError } from '../../domain/errors/conflict.error';

import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
   function createHost() {
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));
      const response = { status } as unknown as Response;
      const host = {
         switchToHttp: () => ({
            getResponse: () => response,
         }),
      } as unknown as Parameters<AllExceptionsFilter['catch']>[1];
      return { json, status, host };
   }

   it('should handle HttpException', () => {
      const { json, status, host } = createHost();
      const filter = new AllExceptionsFilter();
      filter.catch(new HttpException('Bad', HttpStatus.BAD_REQUEST), host);
      expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(json).toHaveBeenCalledWith({ message: 'Bad' });
   });

   it('should handle custom error with status', () => {
      const { json, status, host } = createHost();
      const filter = new AllExceptionsFilter();
      filter.catch(new ConflictError('Conflict!'), host);
      expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(json).toHaveBeenCalledWith({ message: 'Conflict!' });
   });
});
