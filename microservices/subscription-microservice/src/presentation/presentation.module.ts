import { Module } from '@nestjs/common';

import { GrpcPresentationModule } from './modules/grpc-presentation.module';
import { SubscriptionPresentationModule } from './modules/subscription-presentation.module';

@Module({
   imports: [SubscriptionPresentationModule, GrpcPresentationModule],
   exports: [SubscriptionPresentationModule, GrpcPresentationModule],
})
export class PresentationModule {}
