import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { weatherGrpcOptions } from './infrastructure/grpc/weather-grpc.options';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.connectMicroservice(weatherGrpcOptions);
   await app.startAllMicroservices();

   if (applicationConfig.environment !== 'production') {
      const swaggerDoc = SwaggerModule.createDocument(
         app,
         new DocumentBuilder().setTitle('Weather Microservice').build(),
      );
      SwaggerModule.setup('/', app, swaggerDoc);
   }

   app.enableCors();
   app.useGlobalFilters(new AllExceptionsFilter());
   const port = applicationConfig.port || 3000;
   await app.listen(port);
}

bootstrap().catch(console.error);
