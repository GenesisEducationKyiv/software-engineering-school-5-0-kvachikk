import { join } from 'node:path';
import { GrpcOptions, Transport } from '@nestjs/microservices';

export const weatherGrpcOptions: GrpcOptions = {
   transport: Transport.GRPC,
   options: {
      url: process.env.WEATHER_GRPC_URL ?? '0.0.0.0:50051',
      package: 'weather',
      protoPath: join(__dirname, '../../../../../../proto/weather.proto'),
   },
}; 