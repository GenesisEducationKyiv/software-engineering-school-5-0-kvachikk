import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { FileLogger, AppLogger } from '../../shared/logger/logger.service';
import { LOGGER } from '../../shared/tokens/logger.token';
import { CACHE_SERVICE } from '../../shared/tokens/service-tokens';
import { ApiWeatherProvider } from '../providers/api-weather-provider';
import { CacheWeatherProxy } from '../providers/cache-weather.proxy';
import { LoggingWeatherDecorator } from '../providers/logging-weather.decorator';
import { OpenWeatherProvider } from '../providers/open-weather.provider';
import { CacheService } from '../services/cache.service';
import { MetricsCacheDecorator } from '../services/metrics-cache.decorator';

import { MetricsModule } from './metrics.module';

@Global()
@Module({
   imports: [HttpModule, MetricsModule],
   providers: [
      FileLogger,
      {
         provide: LOGGER,
         useClass: AppLogger,
      },
      {
         provide: OpenWeatherProvider,
         useFactory: (logger: AppLogger, httpService: HttpService) => {
            const provider = new OpenWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'OpenWeather');
         },
         inject: [LOGGER, HttpService],
      },
      {
         provide: ApiWeatherProvider,
         useFactory: (logger: AppLogger, httpService: HttpService) => {
            const provider = new ApiWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'WeatherAPI');
         },
         inject: [LOGGER, HttpService],
      },
      CacheService,
      {
         provide: CACHE_SERVICE,
         useClass: MetricsCacheDecorator,
      },
      {
         provide: 'WeatherHandler',
         useFactory: (openWeather: OpenWeatherProvider, apiWeather: ApiWeatherProvider, cacheService: CacheService) => {
            openWeather.setNext(apiWeather);
            return new CacheWeatherProxy(openWeather, cacheService);
         },
         inject: [OpenWeatherProvider, ApiWeatherProvider, CACHE_SERVICE],
      },
   ],
   exports: ['WeatherHandler', LOGGER],
})
export class WeatherInfrastructureModule {}
