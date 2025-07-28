import { Global, Module } from '@nestjs/common';

import { AppLogger, FileLogger } from './logger.service';
import { LOGGER } from './logger.token';

@Global()
@Module({
  providers: [
    FileLogger,
    {
      provide: LOGGER,
      useClass: AppLogger,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
