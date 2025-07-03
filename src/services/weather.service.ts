import { Injectable, Inject } from '@nestjs/common';

import { WeatherDataProvider } from '../providers/abstract-chain';
import { Weather } from '../types/weather';

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
