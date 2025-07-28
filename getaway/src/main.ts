import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Logger } from './logger/logger.interface';
import { LOGGER } from './logger/logger.token';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get<Logger>(LOGGER);
  app.useLogger(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
