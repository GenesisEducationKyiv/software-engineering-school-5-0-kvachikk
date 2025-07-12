import { Logger } from './logger.interface';

export abstract class LoggerDecorator implements Logger {
   protected readonly inner: Logger;

   constructor(inner: Logger) {
      this.inner = inner;
   }

   info(msg: string) {
      this.inner.info(msg);
   }
   warn(msg: string) {
      this.inner.warn(msg);
   }
   error(msg: string) {
      this.inner.error(msg);
   }
   debug(msg: string, source?: string, data?: unknown) {
      this.inner.debug(msg, source, data);
   }
   response(msg: string, source: string, data: unknown): void {
      this.inner.response(msg, source, data);
   }
}
