import { Injectable } from '@nestjs/common';

import { CacheService } from '../../application/services/cache.service';
import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';
import { TimeUnits } from '../../shared/constants/time-units';

import { WeatherDataProvider } from './abstract-chain';

@Injectable()
export class CacheWeatherProxy implements WeatherDataProvider {
   constructor(
      private readonly decorate: WeatherDataProvider,
      private readonly cacheService: CacheService,
   ) {}

   setNext(handler: WeatherDataProvider): WeatherDataProvider {
      return this.decorate.setNext(handler);
   }

   async handle(options: GetWeatherOptions): Promise<Weather[]> {
      const cacheKey = options.city.trim().toUpperCase();
      const cachedData = await this.cacheService.getData<Weather[]>(cacheKey);

      if (cachedData) {
         return cachedData;
      }

      const data = await this.decorate.handle(options);
      await this.cacheService.setData(cacheKey, data, TimeUnits.MINUTE * 10);
      return data;
   }
}
