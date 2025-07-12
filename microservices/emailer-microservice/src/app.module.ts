import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailerApplicationModule } from './application/modules/emailer-application.module';
import { GrpcPresentationModule } from './presentation/modules/grpc-presentation.module';

@Module({
   imports: [ScheduleModule.forRoot(), EmailerApplicationModule, GrpcPresentationModule],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
