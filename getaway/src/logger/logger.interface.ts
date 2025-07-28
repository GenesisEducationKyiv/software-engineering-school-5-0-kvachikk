export interface Logger {
   log(msg: string): void;
   info(msg: string): void;
   warn(msg: string): void;
   error(msg: string): void;
   debug(msg: string, source?: string, data?: unknown): void;
   response(msg: string, source: string, data: unknown): void;
} 