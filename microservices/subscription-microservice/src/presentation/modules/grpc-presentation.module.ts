import { Module } from '@nestjs/common';

import { SubscriptionGrpcController } from '../grpc/subscription-grpc.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [SubscriptionGrpcController],
})
export class GrpcPresentationModule {} 