import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.setGlobalPrefix('api');
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const swaggerDocument = YAML.load('./swagger.yaml');
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
   SwaggerModule.setup('docs', app, swaggerDocument);
   app.useGlobalFilters(new AllExceptionsFilter());
   await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
