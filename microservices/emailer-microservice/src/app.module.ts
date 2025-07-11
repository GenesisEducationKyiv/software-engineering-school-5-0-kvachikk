import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailerApplicationModule } from './application/modules/emailer-application.module';

@Module({
   imports: [ScheduleModule.forRoot(), EmailerApplicationModule],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
