import { Logger } from './logger.interface';

export abstract class LoggerDecorator implements Logger {
   protected readonly inner: Logger;

   constructor(inner: Logger) {
      this.inner = inner;
   }

   log(msg: string): void {
      this.inner.log(msg);
   }

   info(msg: string): void {
      this.inner.info(msg);
   }
   warn(msg: string): void {
      this.inner.warn(msg);
   }
   error(msg: string): void {
      this.inner.error(msg);
   }
   debug(msg: string, source?: string, data?: unknown): void {
      this.inner.debug(msg, source, data);
   }
   response(msg: string, source: string, data: unknown): void {
      this.inner.response(msg, source, data);
   }
} 