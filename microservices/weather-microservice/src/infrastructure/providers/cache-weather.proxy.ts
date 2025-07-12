import { Injectable, Inject } from '@nestjs/common';

import { CachePort } from '../../application/ports/cache-service.port';
import { WeatherDataProvider } from '../../application/ports/weather-data-provider.port';
import { Weather } from '../../domain/types/weather';
import { TimeUnits } from '../../shared/constants/time-units';
import { CACHE_SERVICE } from '../../shared/tokens/service-tokens';

@Injectable()
export class CacheWeatherProxy implements WeatherDataProvider {
   constructor(
      private readonly decorate: WeatherDataProvider,
      @Inject(CACHE_SERVICE) private readonly cacheService: CachePort,
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
