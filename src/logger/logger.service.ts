import * as fs from 'node:fs';
import * as path from 'node:path';
import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Logger {
   private readonly logger: winston.Logger;

   constructor() {
      const logDir = path.join(__dirname, '../../../logs');

      if (!fs.existsSync(logDir)) {
         fs.mkdirSync(logDir, { recursive: true });
      }

      this.logger = winston.createLogger({
         level: 'info',
         format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
         transports: [
            new winston.transports.File({
               filename: path.join(logDir, 'error.log'),
               level: 'error',
            }),
            new winston.transports.File({
               filename: path.join(logDir, 'warn.log'),
               level: 'warn',
            }),
            new winston.transports.File({
               filename: path.join(logDir, 'info.log'),
               level: 'info',
            }),
            new winston.transports.File({
               filename: path.join(logDir, 'responses.log'),
               level: 'info',
            }),
         ],
      });

      this.logger.add(
         new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
         }),
      );
   }

   info(log: string): void {
      this.logger.info(log);
   }

   warning(log: string): void {
      this.logger.warn(log);
   }

   error(log: string): void {
      this.logger.error(log);
   }

   response(log: string, source: string, data: unknown): void {
      this.logger.info({
         type: 'response',
         log,
         source,
         data,
      });
   }
}
