import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
   const filter = new AllExceptionsFilter();

   type MockResponse = {
      status: jest.Mock;
      json: jest.Mock;
   };

   const mockResponse = (): MockResponse => {
      const res: MockResponse = {
         status: jest.fn().mockReturnValue(undefined),
         json: jest.fn(),
      };
      // status should return res for chaining, adjust mockImplementation
      res.status.mockReturnValue(res as unknown as MockResponse);
      return res;
   };

   const createHost = (exception: unknown) => {
      const response = mockResponse();
      const host = {
         switchToHttp: () => ({ getResponse: () => response }),
      } as unknown as ArgumentsHost;
      filter.catch(exception, host);
      return response;
   };

   it('handles HttpException', () => {
      const httpEx = new HttpException('bad', HttpStatus.BAD_REQUEST);
      const res = createHost(httpEx);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalled();
   });

   it('handles generic error', () => {
      const res = createHost(new Error('oops'));
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
   });
});
