import { join } from 'node:path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

export const subscriptionGrpcOptions: GrpcOptions = {
   transport: Transport.GRPC,
   options: {
      url: process.env.SUBSCRIPTION_GRPC_URL ?? '0.0.0.0:50053',
      package: 'subscription',
      protoPath: join(__dirname, '../../../../../../proto/subscription.proto'),
   },
};
