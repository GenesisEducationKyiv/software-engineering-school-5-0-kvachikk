import { join } from 'node:path';

import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { RedisConfig } from './config/redis.config';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';
import { SubscriptionModel } from './database/models/subscription.model';
import { DatabaseLoader } from './loaders/database.loader';
import { Logger, FileLogger } from './logger/logger.service';
import { ApiWeatherProvider } from './providers/api-weather-provider';
import { CacheWeatherDecorator } from './providers/cache-weather.decorator';
import { LoggingWeatherDecorator } from './providers/logging-weather.decorator';
import { OpenWeatherProvider } from './providers/open-weather.provider';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { CacheService } from './services/cache.service';
import { EmailTemplateService } from './services/email-template.service';
import { EmailerService } from './services/emailer.service';
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
   ],
   controllers: [SubscriptionController, WeatherController],
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
            return new CacheWeatherDecorator(openWeather, cacheService);
         },
         inject: [OpenWeatherProvider, ApiWeatherProvider, CacheService],
      },
      {
         provide: SubscriptionRepository,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
      SubscriptionService,
      CacheService,
      EmailTemplateService,
   ],
})
export class AppModule {}
