import { LoggerDecorator } from './logger.decorator';
import { AppLogger } from './logger.service';

export class ConsolePrettyLogger extends LoggerDecorator {
   constructor(logger: AppLogger) {
      super(logger);
   }

   private colorize(colorCode: string, msg: string): string {
      return `${colorCode}${msg}\x1b[0m`;
   }

   info(msg: string): void {
      const colored = this.colorize('\x1b[32m', msg); // green
      console.log(colored);
      super.info(msg);
   }

   warn(msg: string): void {
      const colored = this.colorize('\x1b[33m', msg); // yellow
      console.warn(colored);
      super.warn(msg);
   }

   error(msg: string): void {
      const colored = this.colorize('\x1b[31m', msg); // red
      console.error(colored);
      super.error(msg);
   }

   response(msg: string, source: string, data: unknown): void {
      const colored = this.colorize('\x1b[35m', `[${source}] ${msg}`); // magenta
      console.log(colored, data);
      super.response(msg, source, data);
   }
} 