import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { EmailerInfrastructureModule } from '../../infrastructure/modules/emailer-infrastructure.module';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailerService } from '../services/emailer.service';
import { SchedulerService } from '../services/scheduler.service';
import { EmailValidationService } from '../services/validator.service';
import { WeatherService } from '../services/weather.service';

@Module({
   imports: [ScheduleModule.forRoot(), EmailerInfrastructureModule],
   providers: [EmailerService, EmailTemplateService, EmailValidationService, WeatherService, SchedulerService],
   exports: [EmailerService],
})
export class EmailerApplicationModule {}
