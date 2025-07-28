import { Global, Module } from '@nestjs/common';

import { AppLogger, FileLogger } from './logger.service';

@Global()
@Module({
  providers: [FileLogger, AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
