import { Module } from '@nestjs/common';

import { SubscriptionApplicationModule } from '../../application/modules/subscription-application.module';
import { SubscriptionController } from '../controllers/subscription.controller';

@Module({
   imports: [SubscriptionApplicationModule],
   controllers: [SubscriptionController],
})
export class SubscriptionPresentationModule {}
