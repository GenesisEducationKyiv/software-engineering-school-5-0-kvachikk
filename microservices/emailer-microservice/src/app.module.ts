import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailerApplicationModule } from './application/modules/emailer-application.module';
import { GrpcPresentationModule } from './presentation/modules/grpc-presentation.module';
import { MetricsPresentationModule } from './presentation/modules/metrics-presentation.module';

@Module({
   imports: [ScheduleModule.forRoot(), EmailerApplicationModule, GrpcPresentationModule, MetricsPresentationModule],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
