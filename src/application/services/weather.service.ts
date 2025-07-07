import { Injectable, Inject } from '@nestjs/common';

import { Weather } from '../../domain/types/weather';
import { WeatherDataProvider } from '../ports/weather-data-provider.port';

@Injectable()
export class WeatherService {
   constructor(@Inject('WeatherHandler') private readonly provider: WeatherDataProvider) {}

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      return this.provider.handle({ city, date: new Date() });
   }

   public async getCurrentWeather(city: string): Promise<Weather> {
      return (await this.getWeatherForecast(city))[0];
   }
}
