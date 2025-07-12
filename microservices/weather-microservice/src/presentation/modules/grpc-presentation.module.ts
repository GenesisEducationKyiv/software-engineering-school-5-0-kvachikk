import { Module } from '@nestjs/common';

import { WeatherGrpcController } from '../grpc/weather-grpc.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
   imports: [ApplicationModule],
   controllers: [WeatherGrpcController],
})
export class GrpcPresentationModule {} 