import { ILogger } from './logger.interface';

export abstract class LoggerDecorator implements ILogger {
   protected constructor(protected readonly inner: ILogger) {}

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
