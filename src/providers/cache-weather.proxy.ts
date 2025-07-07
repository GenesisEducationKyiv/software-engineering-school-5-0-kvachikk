import { Injectable } from '@nestjs/common';

import { CacheTTL } from '../constants/cache-ttl';
import { CacheService } from '../services/cache.service';
import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class CacheWeatherProxy extends ChainableWeatherProvider {
   constructor(
      private readonly decorate: ChainableWeatherProvider,
      private readonly cacheService: CacheService,
   ) {
      super();
   }

   setNext(handler: ChainableWeatherProvider): ChainableWeatherProvider {
      return this.decorate.setNext(handler);
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      const cacheKey = options.city.trim().toUpperCase();
      const cachedData = await this.cacheService.getData<Weather[]>(cacheKey);

      if (cachedData) {
         return cachedData;
      }

      const data = await this.decorate.handle(options);
      await this.cacheService.setData(cacheKey, data, CacheTTL.TEN_MINUTE);
      return data;
   }
}
