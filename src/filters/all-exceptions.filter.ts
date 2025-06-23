import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type ErrorWithStatus = {
   status: number;
   message?: string;
};

type SequelizeUniqueConstraintError = {
   name: 'SequelizeUniqueConstraintError';
   message?: string;
};

function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
   return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as Record<string, unknown>).status === 'number'
   );
}

function isSequelizeUniqueConstraintError(error: unknown): error is SequelizeUniqueConstraintError {
   return (
      typeof error === 'object' &&
      error !== null &&
      (error as Record<string, unknown>).name === 'SequelizeUniqueConstraintError'
   );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
   catch(exception: unknown, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let responseBody: Record<string, unknown> = { message: 'Internal server error' };

      if (exception instanceof HttpException) {
         status = exception.getStatus();
         const resBody = exception.getResponse();

         responseBody = typeof resBody === 'string' ? { message: resBody } : (resBody as Record<string, unknown>);
      } else if (isErrorWithStatus(exception)) {
         status = exception.status;
         responseBody = { message: exception.message ?? responseBody.message };
      } else if (isSequelizeUniqueConstraintError(exception)) {
         status = HttpStatus.CONFLICT;
         responseBody = { message: exception.message ?? 'Conflict' };
      }

      response.status(status).json(responseBody);
   }
}
