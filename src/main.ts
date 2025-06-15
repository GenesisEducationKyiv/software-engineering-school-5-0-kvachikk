import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.setGlobalPrefix('api');
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const swaggerDocument = YAML.load('./swagger.yaml');
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
   SwaggerModule.setup('docs', app, swaggerDocument);
   await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
