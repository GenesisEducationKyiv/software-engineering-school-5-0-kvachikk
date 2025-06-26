import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { applicationConfig } from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   if (applicationConfig.environment === 'development') {
      const swaggerDoc = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Weather API').build());
      SwaggerModule.setup('/', app, swaggerDoc);
   }

   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(applicationConfig.port);
}

bootstrap().catch(console.error);
