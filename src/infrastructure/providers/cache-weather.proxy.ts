import { Injectable } from '@nestjs/common';

import { WeatherDataProvider } from '../../application/ports/weather-data-provider.port';
import { CacheService } from '../../application/services/cache.service';
import { Weather } from '../../domain/types/weather';
import { TimeUnits } from '../../shared/constants/time-units';

@Injectable()
export class CacheWeatherProxy implements WeatherDataProvider {
   constructor(
      private readonly decorate: WeatherDataProvider,
      private readonly cacheService: CacheService,
   ) {}

   async handle(options: { city: string; date: Date }): Promise<Weather[]> {
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
