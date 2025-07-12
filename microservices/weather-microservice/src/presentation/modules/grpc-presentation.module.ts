import { Module } from '@nestjs/common';

import { ApplicationModule } from '../../application/application.module';
import { WeatherGrpcController } from '../grpc/weather-grpc.controller';

@Module({
   imports: [ApplicationModule],
   controllers: [WeatherGrpcController],
})
export class GrpcPresentationModule {}
