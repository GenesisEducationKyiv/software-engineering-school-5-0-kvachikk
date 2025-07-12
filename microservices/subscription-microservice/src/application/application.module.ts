import { Module } from '@nestjs/common';

import { SubscriptionApplicationModule } from './modules/subscription-application.module';

@Module({
   imports: [SubscriptionApplicationModule],
   exports: [SubscriptionApplicationModule],
})
export class ApplicationModule {}
