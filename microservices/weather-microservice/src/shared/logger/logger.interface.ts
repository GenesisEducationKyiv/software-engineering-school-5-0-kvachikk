export interface Logger {
   info(_msg: string): void;
   warn(_msg: string): void;
   error(_msg: string): void;
   debug(_msg: string, _source?: string, _data?: unknown): void;
   response(msg: string, source: string, data: unknown): void;
}
