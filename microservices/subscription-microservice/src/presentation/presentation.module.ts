import { Module } from '@nestjs/common';

import { SubscriptionPresentationModule } from './modules/subscription-presentation.module';
import { GrpcPresentationModule } from './modules/grpc-presentation.module';

@Module({
  imports: [SubscriptionPresentationModule, GrpcPresentationModule],
  exports: [SubscriptionPresentationModule, GrpcPresentationModule],
})
export class PresentationModule {}
