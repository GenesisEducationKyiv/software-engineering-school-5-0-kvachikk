import * as fs from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { Logger } from './logger.interface';

@Injectable()
export class FileLogger implements Logger {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
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
  }

  log(msg: string): void {
    this.logger.info(msg);
  }

  info(msg: string): void {
    this.logger.info(msg);
  }

  warn(msg: string): void {
    this.logger.warn(msg);
  }

  error(msg: string): void {
    this.logger.error(msg);
  }

  debug(msg: string, source?: string, data?: unknown): void {
    this.logger.debug(
      `[${source ?? ''}] ${msg} ${data ? JSON.stringify(data) : ''}`,
    );
  }

  response(msg: string, source: string, data: unknown): void {
    this.logger.log({
      level: 'info',
      message: msg,
      type: 'response',
      source,
      data,
    });
  }
}

@Injectable()
export class AppLogger implements Logger {
  constructor(private readonly base: FileLogger) {}

  private readonly sampleRate = Math.min(
    Math.max(parseFloat(process.env.LOG_SAMPLE_RATE ?? '1'), 0),
    1,
  );

  private shouldLog(): boolean {
    return Math.random() < this.sampleRate;
  }

  info(msg: string): void {
    if (this.shouldLog()) this.base.info(msg);
  }
  warn(msg: string): void {
    if (this.shouldLog()) this.base.warn(msg);
  }
  error(msg: string): void {
    if (this.shouldLog()) this.base.error(msg);
  }
  debug(msg: string, source?: string, data?: unknown): void {
    if (this.shouldLog()) this.base.debug(msg, source, data);
  }
  response(msg: string, source: string, data: unknown): void {
    if (this.shouldLog()) this.base.response(msg, source, data);
  }
}
