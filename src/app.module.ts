import { join } from 'node:path';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

import { RedisConfig } from './config/redis.config';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';
import { SubscriptionModel } from './database/models/subscription.model';
import { DatabaseLoader } from './loaders/database.loader';
import { Logger, FileLogger } from './logger/logger.service';
import { ApiWeatherHandler } from './providers/api-weather.handler';
import { OpenWeatherHandler } from './providers/open-weather.handler';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { CacheService } from './services/cache.service';
import { EmailTemplateService } from './services/email-template.service';
import { EmailerService } from './services/emailer.service';
import { SchedulerService } from './services/scheduler.service';
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
      ScheduleModule.forRoot(),
      CacheModule.registerAsync(RedisConfig),
   ],
   controllers: [SubscriptionController, WeatherController],
   providers: [
      EmailerService,
      EmailValidationService,
      WeatherService,
      SchedulerService,
      DatabaseLoader,
      FileLogger,
      Logger,
      OpenWeatherHandler,
      ApiWeatherHandler,
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
