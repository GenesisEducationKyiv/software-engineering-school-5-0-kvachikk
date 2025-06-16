import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = (typeof res === 'string') ? res : (res.message ?? message);
    } else if (typeof exception === 'object' && exception !== null) {
      const anyEx = exception as any;
      if (anyEx.status && typeof anyEx.status === 'number') {
        status = anyEx.status;
        message = anyEx.message ?? message;
      }
      // Sequelize unique constraint => 409
      if (anyEx.name === 'SequelizeUniqueConstraintError') {
        status = HttpStatus.CONFLICT;
        message = anyEx.message ?? 'Conflict';
      }
    }

    response.status(status).json({ message });
  }
} 