import { LoggerDecorator } from './logger.decorator';
import { ILogger } from './logger.interface';

export class ConsolePrettyLogger extends LoggerDecorator {
   constructor(inner: ILogger) {
      super(inner);
   }

   private colorize(colorCode: string, msg: string): string {
      return `${colorCode}${msg}\x1b[0m`;
   }

   info(msg: string): void {
      const colored = this.colorize('\x1b[32m', msg); // green
      console.log(colored);
      super.info(msg);
   }

   warning(msg: string): void {
      const colored = this.colorize('\x1b[33m', msg); // yellow
      console.warn(colored);
      super.warning(msg);
   }

   error(msg: string): void {
      const colored = this.colorize('\x1b[31m', msg); // red
      console.error(colored);
      super.error(msg);
   }

   response(msg: string, source: string, data: unknown): void {
      // Magenta for responses
      const colored = this.colorize('\x1b[35m', `[${source}] ${msg}`);
      console.log(colored, data);
      super.response(msg, source, data);
   }
}
