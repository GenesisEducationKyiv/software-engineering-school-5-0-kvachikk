import { Injectable, Inject } from '@nestjs/common';

import { CacheTTL } from '../constants/cache-ttl';
import { WeatherHandler } from '../providers/weather.handler';
import { Weather } from '../types/weather';

import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {
   constructor(
      private readonly cacheService: CacheService,
      @Inject('WeatherHandler') private readonly handler: WeatherHandler,
   ) {}

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      const key = city.trim().toUpperCase();
      const cache = await this.cacheService.getData<Weather[]>(key);
      if (cache) return cache;

      const weatherData = await this.handler.handle(city);

      await this.cacheService.setData(key, weatherData, CacheTTL.TEN_MINUTE);
      return weatherData;
   }

   public async getCurrentWeather(city: string): Promise<Weather> {
      return (await this.getWeatherForecast(city))[0];
   }
}
