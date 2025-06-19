import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
   catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      // Default values
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      let responseBody: any = { message: 'Internal server error' };

      if (exception instanceof HttpException) {
         status = exception.getStatus();
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         const res = exception.getResponse() as any;

         if (typeof res === 'string') {
            responseBody = { message: res };
         } else {
            // Preserve full object (e.g., validation errors)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            responseBody = res;
         }
      } else if (typeof exception === 'object' && exception !== null) {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         const anyEx = exception as any;
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         if (anyEx.status && typeof anyEx.status === 'number') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            status = anyEx.status;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            responseBody = { message: anyEx.message ?? responseBody.message };
         }
         // Sequelize unique constraint => 409
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         if (anyEx.name === 'SequelizeUniqueConstraintError') {
            status = HttpStatus.CONFLICT;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            responseBody = { message: anyEx.message ?? 'Conflict' };
         }
      }

      response.status(status).json(responseBody);
   }
}
