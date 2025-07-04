import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { AllExceptionsFilter } from './presentation/filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, { cors: true });

   if (applicationConfig.environment !== 'production') {
      const swaggerDoc = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Weather API').build());
      SwaggerModule.setup('/', app, swaggerDoc);
   }

   app.enableCors();
   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(applicationConfig.port);
}

bootstrap().catch(console.error);
