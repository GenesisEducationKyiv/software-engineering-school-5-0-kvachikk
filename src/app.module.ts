import { join } from 'node:path';

import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { MetricsModule } from './application/modules/metrics.module';
import { SubscriptionRepositoryPort } from './application/ports/subscription-repository.port';
import { CacheService } from './application/services/cache.service';
import { EmailTemplateService } from './application/services/email-template.service';
import { EmailerService } from './application/services/emailer.service';
import { MonitoredCacheService } from './application/services/monitored-cache.service';
import { SubscriptionService } from './application/services/subscription/subscription.service';
import { EmailValidationService } from './application/services/validator.service';
import { WeatherService } from './application/services/weather.service';
import { ApplicationConfigProvider } from './infrastructure/config/application.config';
import { MailConfigProvider } from './infrastructure/config/mail.config';
import { RedisConfig } from './infrastructure/config/redis.config';
import { SubscriptionModel } from './infrastructure/database/models/subscription.model';
import { DatabaseLoader } from './infrastructure/loaders/database.loader';
import { AppLogger, FileLogger } from './infrastructure/logger/logger.service';
import { ApiWeatherProvider } from './infrastructure/providers/api-weather-provider';
import { CacheWeatherProxy } from './infrastructure/providers/cache-weather.proxy';
import { LoggingWeatherDecorator } from './infrastructure/providers/logging-weather.decorator';
import { OpenWeatherProvider } from './infrastructure/providers/open-weather.provider';
import { SubscriptionRepository } from './infrastructure/repositories/subscription.repository';
import { MetricsController } from './presentation/controllers/metrics.controller';
import { SubscriptionController } from './presentation/controllers/subscription.controller';
import { WeatherController } from './presentation/controllers/weather.controller';

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
      ApplicationConfigProvider,
      MailConfigProvider,
   ],
})
export class AppModule {}
