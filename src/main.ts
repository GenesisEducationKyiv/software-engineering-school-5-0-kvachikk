import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.setGlobalPrefix('api');

   const swaggerConfig = new DocumentBuilder().setTitle('Weather API').setVersion('1.0').build();
   SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

   app.useGlobalFilters(new AllExceptionsFilter());

   await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
