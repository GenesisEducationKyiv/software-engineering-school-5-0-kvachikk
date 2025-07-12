import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { AllExceptionsFilter } from './presentation/filters/all-exceptions.filter';
import { subscriptionGrpcOptions } from './infrastructure/grpc/subscription-grpc.options';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.connectMicroservice(subscriptionGrpcOptions);
   await app.startAllMicroservices();

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
   const port = applicationConfig.port || 3000;
   await app.listen(port);
}

void bootstrap();
