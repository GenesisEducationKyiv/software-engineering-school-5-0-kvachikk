import { Module } from '@nestjs/common';

import { MetricsPresentationModule } from './modules/metrics-presentation.module';
import { WeatherPresentationModule } from './modules/weather-presentation.module';

@Module({
   imports: [WeatherPresentationModule, MetricsPresentationModule],
   exports: [WeatherPresentationModule, MetricsPresentationModule],
})
export class PresentationModule {}
