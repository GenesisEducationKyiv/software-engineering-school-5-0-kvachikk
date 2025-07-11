import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { AllExceptionsFilter } from './presentation/filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   if (applicationConfig.environment !== 'production') {
      const swaggerDoc = SwaggerModule.createDocument(
         app,
         new DocumentBuilder().setTitle('Subscriptions Microservice').build(),
      );
      SwaggerModule.setup('/', app, swaggerDoc);
   }

   app.use(helmet());
   app.enableCors();
   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(3000);
}

bootstrap().catch(console.error);
