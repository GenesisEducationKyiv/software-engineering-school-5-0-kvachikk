import { Module } from '@nestjs/common';

import { SubscriptionPresentationModule } from './modules/subscription-presentation.module';

@Module({
   imports: [SubscriptionPresentationModule],
   exports: [SubscriptionPresentationModule],
})
export class PresentationModule {}
