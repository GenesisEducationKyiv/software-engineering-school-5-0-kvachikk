import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { MetricsModule } from '../../application/modules/metrics.module';
import { WeatherApplicationModule } from '../../application/modules/weather-application.module';
import { CacheService } from '../../application/services/cache.service';
import { MonitoredCacheService } from '../../application/services/monitored-cache.service';
import { FileLogger, AppLogger } from '../logger/logger.service';
import { ApiWeatherProvider } from '../providers/api-weather-provider';
import { CacheWeatherProxy } from '../providers/cache-weather.proxy';
import { LoggingWeatherDecorator } from '../providers/logging-weather.decorator';
import { OpenWeatherProvider } from '../providers/open-weather.provider';

@Global()
@Module({
   imports: [HttpModule, MetricsModule, WeatherApplicationModule],
   providers: [
      FileLogger,
      AppLogger,
      {
         provide: OpenWeatherProvider,
         useFactory: (logger: AppLogger, httpService: HttpService) => {
            const provider = new OpenWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'OpenWeather');
         },
         inject: [AppLogger, HttpService],
      },
      {
         provide: ApiWeatherProvider,
         useFactory: (logger: AppLogger, httpService: HttpService) => {
            const provider = new ApiWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'WeatherAPI');
         },
         inject: [AppLogger, HttpService],
      },
      {
         provide: CacheService,
         useClass: MonitoredCacheService,
      },
      {
         provide: 'WeatherHandler',
         useFactory: (openWeather: OpenWeatherProvider, apiWeather: ApiWeatherProvider, cacheService: CacheService) => {
            openWeather.setNext(apiWeather);
            return new CacheWeatherProxy(openWeather, cacheService);
         },
         inject: [OpenWeatherProvider, ApiWeatherProvider, CacheService],
      },
   ],
   exports: ['WeatherHandler'],
})
export class WeatherInfrastructureModule {}
