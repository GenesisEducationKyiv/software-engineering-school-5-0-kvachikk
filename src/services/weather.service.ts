import { Injectable, Inject } from '@nestjs/common';

import { CacheTTL } from '../constants/cache-ttl';
import { WeatherQueryDto } from '../dtos/weather-query.dto';
import { WeatherDataProvider } from '../providers/abstract-chain';
import { Weather } from '../types/weather';

import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {
   constructor(
      private readonly cacheService: CacheService,
      @Inject('WeatherHandler') private readonly provider: WeatherDataProvider,
   ) {}

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      const key = city.trim().toUpperCase();
      const cache = await this.cacheService.getData<Weather[]>(key);
      if (cache) return cache;

      const options = { city, date: new Date() };
      const weatherData = await this.provider.handle(options);

      await this.cacheService.setData(key, weatherData, CacheTTL.TEN_MINUTE);
      return weatherData;
   }

   public async getCurrentWeather(city: string): Promise<Weather> {
      return (await this.getWeatherForecast(city))[0];
   }
}
