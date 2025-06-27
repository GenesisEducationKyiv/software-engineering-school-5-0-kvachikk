import { Injectable } from '@nestjs/common';

import { ApiWeatherHandler } from '../providers/api-weather.handler';
import { OpenWeatherHandler } from '../providers/open-weather.handler';
import { WeatherHandler } from '../providers/weather.handler';
import { Weather } from '../types/weather';

import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {
   private handler: WeatherHandler;

   constructor(
      openWeatherHandler: OpenWeatherHandler,
      apiWeatherHandler: ApiWeatherHandler,
      private readonly cacheService: CacheService,
   ) {
      openWeatherHandler.setNext(apiWeatherHandler);

      this.handler = openWeatherHandler;
   }

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      const key = city.trim().toUpperCase();
      const cache = await this.cacheService.getData<Weather[]>(key);
      if (cache) return cache;

      const weatherData = await this.handler.handle(city);

      await this.cacheService.setData(key, weatherData, 60 * 60); //saves cache for 1 hour
      return weatherData;
   }

   public async getCurrentWeather(city: string): Promise<Weather> {
      return (await this.getWeatherForecast(city))[0];
   }
}
