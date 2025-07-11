import { Injectable } from '@nestjs/common';

import { CacheService } from '../../application/services/cache.service';
import { CacheTTL } from '../../domain/constants/cache-ttl';
import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';

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
