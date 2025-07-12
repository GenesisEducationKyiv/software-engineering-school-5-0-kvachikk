import {
   applyDecorators,
   SetMetadata,
   UseInterceptors,
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { AppLogger } from './logger.service';

@Injectable()
class LoggingInterceptor implements NestInterceptor {
   constructor(private readonly logger: AppLogger) {}

   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const request = context.switchToHttp().getRequest();
      const { method, url } = request;
      const start = Date.now();

      return next.handle().pipe(
         tap((data) => {
            const duration = Date.now() - start;
            this.logger.response(`${method} ${url} ${duration}ms`, 'HTTP', data);
         }),
      );
   }
}

export const Loggable = (): ClassDecorator & MethodDecorator => {
   return applyDecorators(SetMetadata('loggable', true), UseInterceptors(LoggingInterceptor));
};
