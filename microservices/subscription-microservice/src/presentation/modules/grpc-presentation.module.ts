import { Module } from '@nestjs/common';

import { ApplicationModule } from '../../application/application.module';
import { SubscriptionGrpcController } from '../grpc/subscription-grpc.controller';

@Module({
   imports: [ApplicationModule],
   controllers: [SubscriptionGrpcController],
})
export class GrpcPresentationModule {}
