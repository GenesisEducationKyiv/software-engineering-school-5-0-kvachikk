import { Module } from '@nestjs/common';

import { WeatherApplicationModule } from './modules/weather-application.module';

@Module({
   imports: [WeatherApplicationModule],
   exports: [WeatherApplicationModule],
})
export class ApplicationModule {}
