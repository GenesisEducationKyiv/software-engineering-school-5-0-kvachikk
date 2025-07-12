import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { applicationConfig } from './infrastructure/config/application.config';
import { emailerGrpcOptions } from './infrastructure/grpc/emailer-grpc.options';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.connectMicroservice(emailerGrpcOptions);
   await app.startAllMicroservices();
   app.enableCors();
   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(applicationConfig.port ?? 3000);
}
void bootstrap();
