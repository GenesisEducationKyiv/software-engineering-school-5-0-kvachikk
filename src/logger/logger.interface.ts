export interface ILogger {
   info(msg: string): void;
   warning(msg: string): void;
   error(msg: string): void;
   response(msg: string, source: string, data: unknown): void;
}
