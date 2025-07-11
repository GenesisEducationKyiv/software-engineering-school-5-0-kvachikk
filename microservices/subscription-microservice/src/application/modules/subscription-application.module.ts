import { Module } from '@nestjs/common';

import { CityValidatorService } from '../services/city-validator.service';
import { SubscriptionService } from '../services/subscription.service';

@Module({
   providers: [SubscriptionService, CityValidatorService],
   exports: [SubscriptionService],
})
export class SubscriptionApplicationModule {}
