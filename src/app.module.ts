import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';
import { FrequencyModel } from './database/models/frequency.model';
import { SubscriptionModel } from './database/models/subscription.model';
import { DatabaseLoader } from './loaders/database.loader';
import { EmailSchedulerLoader } from './loaders/email-scheduler.loader';
import { Logger } from './logger/logger.service';
import { ApiWeatherHandler } from './providers/api-weather.handler';
import { OpenWeatherHandler } from './providers/open-weather.handler';
import { SubscriptionRepository } from './repositories/subscription-repository';
import { NotificationService } from './services/emails/notification';
import { SchedulerService } from './services/emails/scheduler';
import { EmailService } from './services/emails/sender';
import { EmailValidationService } from './services/emails/validation';
import { SubscriptionService } from './services/subscription/subscription.service';
import { WeatherServices } from './services/weather/weather.services';

@Module({
   imports: [ConfigModule.forRoot({ isGlobal: true })],
   controllers: [SubscriptionController, WeatherController],
   providers: [
      EmailService,
      EmailValidationService,
      NotificationService,
      WeatherServices,
      SchedulerService,
      DatabaseLoader,
      EmailSchedulerLoader,
      Logger,
      OpenWeatherHandler,
      ApiWeatherHandler,
      {
         provide: SubscriptionRepository,
         useFactory: () => new SubscriptionRepository(SubscriptionModel, FrequencyModel),
      },
      SubscriptionService,
   ],
})
export class AppModule {}
