import { Module } from '@nestjs/common';

import { MetricsModule } from './modules/metrics.module';
import { WeatherInfrastructureModule } from './modules/weather-infrastructure.module';

@Module({
   imports: [WeatherInfrastructureModule, MetricsModule],
   exports: [WeatherInfrastructureModule, MetricsModule],
})
export class InfrastructureModule {}
