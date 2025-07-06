import { Module } from '@nestjs/common';

import { WeatherService } from '../services/weather.service';

@Module({
   providers: [WeatherService],
   exports: [WeatherService],
})
export class WeatherApplicationModule {}
