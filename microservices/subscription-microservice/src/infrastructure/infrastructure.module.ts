import { Module } from '@nestjs/common';

import { SubscriptionInfrastructureModule } from './modules/subscription-infrastructure.module';

@Module({
   imports: [SubscriptionInfrastructureModule],
   exports: [SubscriptionInfrastructureModule],
})
export class InfrastructureModule {}
