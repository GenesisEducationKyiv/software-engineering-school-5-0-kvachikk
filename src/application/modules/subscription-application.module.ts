import { Module, forwardRef } from '@nestjs/common';

import { EmailTemplateService } from '../services/email-template.service';
import { EmailerService } from '../services/emailer.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { EmailValidationService } from '../services/validator.service';

import { WeatherApplicationModule } from './weather-application.module';

@Module({
   imports: [forwardRef(() => WeatherApplicationModule)],
   providers: [EmailTemplateService, EmailValidationService, EmailerService, SubscriptionService],
   exports: [SubscriptionService],
})
export class SubscriptionApplicationModule {}
