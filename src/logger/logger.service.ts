import * as fs from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { applicationConfig } from '../config/application.config';

import { ConsolePrettyLogger } from './console-pretty.logger';
import { ILogger } from './logger.interface';

@Injectable()
export class FileLogger implements ILogger {
   private readonly logger: winston.Logger;

   constructor() {
      const logDir = path.join(__dirname, '../../logs');

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

      if (applicationConfig.environment !== 'production') {
         this.logger.add(
            new winston.transports.Console({
               format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
            }),
         );
      }
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

@Injectable()
export class Logger implements ILogger {
   private readonly decorated: ILogger;

   constructor(private readonly base: FileLogger) {
      let logger: ILogger = base;
      if (applicationConfig.environment !== 'production') {
         logger = new ConsolePrettyLogger(logger);
      }
      this.decorated = logger;
   }

   info(msg: string): void {
      this.decorated.info(msg);
   }

   warning(msg: string): void {
      this.decorated.warning(msg);
   }

   error(msg: string): void {
      this.decorated.error(msg);
   }

   response(msg: string, source: string, data: unknown): void {
      this.decorated.response(msg, source, data);
   }
}
