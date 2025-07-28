import { Module } from '@nestjs/common';

import { GrpcPresentationModule } from './modules/grpc-presentation.module';
import { MetricsPresentationModule } from './modules/metrics-presentation.module';
import { SubscriptionPresentationModule } from './modules/subscription-presentation.module';

@Module({
   imports: [SubscriptionPresentationModule, GrpcPresentationModule, MetricsPresentationModule],
   exports: [SubscriptionPresentationModule, GrpcPresentationModule, MetricsPresentationModule],
})
export class PresentationModule {}
