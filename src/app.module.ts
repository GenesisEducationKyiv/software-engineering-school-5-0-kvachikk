import { join } from 'node:path';

import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { RedisConfig } from './config/redis.config';
import { MetricsController } from './controllers/metrics.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';
import { SubscriptionModel } from './database/models/subscription.model';
import { DatabaseLoader } from './loaders/database.loader';
import { Logger, FileLogger } from './logger/logger.service';
import { MetricsModule } from './metrics/metrics.module';
import { SubscriptionRepositoryPort } from './ports/subscription-repository.port';
import { ApiWeatherProvider } from './providers/api-weather-provider';
import { CacheWeatherProxy } from './providers/cache-weather.proxy';
import { LoggingWeatherDecorator } from './providers/logging-weather.decorator';
import { OpenWeatherProvider } from './providers/open-weather.provider';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { CacheService } from './services/cache.service';
import { EmailTemplateService } from './services/email-template.service';
import { EmailerService } from './services/emailer.service';
import { MonitoredCacheService } from './services/monitored-cache.service';
import { SubscriptionService } from './services/subscription/subscription.service';
import { EmailValidationService } from './services/validator.service';
import { WeatherService } from './services/weather.service';

@Module({
   imports: [
      ServeStaticModule.forRoot({
         rootPath: join(__dirname, '..', 'public'),
         serveRoot: '/public',
      }),
      ConfigModule.forRoot({ isGlobal: true }),
      CacheModule.registerAsync(RedisConfig),
      HttpModule,
      MetricsModule,
   ],
   controllers: [SubscriptionController, WeatherController, MetricsController],
   providers: [
      EmailerService,
      EmailValidationService,
      WeatherService,
      DatabaseLoader,
      FileLogger,
      Logger,
      {
         provide: OpenWeatherProvider,
         useFactory: (logger: Logger, httpService: HttpService) => {
            const provider = new OpenWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'OpenWeather');
         },
         inject: [Logger, HttpService],
      },
      {
         provide: ApiWeatherProvider,
         useFactory: (logger: Logger, httpService: HttpService) => {
            const provider = new ApiWeatherProvider(httpService);
            return new LoggingWeatherDecorator(provider, logger, 'WeatherAPI');
         },
         inject: [Logger, HttpService],
      },
      {
         provide: 'WeatherHandler',
         useFactory: (openWeather: OpenWeatherProvider, apiWeather: ApiWeatherProvider, cacheService: CacheService) => {
            openWeather.setNext(apiWeather);
            return new CacheWeatherProxy(openWeather, cacheService);
         },
         inject: [OpenWeatherProvider, ApiWeatherProvider, CacheService],
      },
      {
         provide: SubscriptionRepositoryPort,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
      SubscriptionService,
      {
         provide: CacheService,
         useClass: MonitoredCacheService,
      },
      EmailTemplateService,
   ],
})
export class AppModule {}
