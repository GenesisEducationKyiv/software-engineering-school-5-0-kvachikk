import { LoggerInterface } from './logger.interface';

export abstract class LoggerDecorator implements LoggerInterface {
   protected constructor(protected readonly inner: LoggerInterface) {}

   info(msg: string) {
      this.inner.info(msg);
   }
   warning(msg: string) {
      this.inner.warning(msg);
   }
   error(msg: string) {
      this.inner.error(msg);
   }
   response(log: string, source: string, data: unknown) {
      this.inner.response(log, source, data);
   }
}
