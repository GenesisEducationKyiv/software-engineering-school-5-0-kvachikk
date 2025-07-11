import { Module } from '@nestjs/common';

import { WeatherApplicationModule } from '../../application/modules/weather-application.module';
import { WeatherController } from '../controllers/weather.controller';

@Module({
   imports: [WeatherApplicationModule],
   controllers: [WeatherController],
})
export class WeatherPresentationModule {}
