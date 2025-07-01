import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { applicationConfig } from './config/application.config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppModule } from './modules/app.module';

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
