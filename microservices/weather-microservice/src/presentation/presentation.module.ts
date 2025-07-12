import { Module } from '@nestjs/common';

import { GrpcPresentationModule } from './modules/grpc-presentation.module';
import { MetricsPresentationModule } from './modules/metrics-presentation.module';
import { WeatherPresentationModule } from './modules/weather-presentation.module';

@Module({
   imports: [WeatherPresentationModule, MetricsPresentationModule, GrpcPresentationModule],
   exports: [WeatherPresentationModule, MetricsPresentationModule, GrpcPresentationModule],
})
export class PresentationModule {}
