import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      HttpModule,
      ApplicationModule,
      InfrastructureModule,
      PresentationModule,
   ],
   controllers: [],
   providers: [],
})
export class AppModule {}
