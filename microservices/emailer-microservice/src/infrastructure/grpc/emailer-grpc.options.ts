import { join } from 'node:path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

export const emailerGrpcOptions: GrpcOptions = {
   transport: Transport.GRPC,
   options: {
      url: process.env.EMAILER_GRPC_URL ?? '0.0.0.0:50052',
      package: 'emailer',
      protoPath: join(__dirname, '../../../../../../proto/emailer.proto'),
   },
};
