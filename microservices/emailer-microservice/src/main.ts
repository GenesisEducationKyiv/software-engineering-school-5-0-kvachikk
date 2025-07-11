import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.enableCors();
   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(applicationConfig.port ?? 3000);
}
void bootstrap();
