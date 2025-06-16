import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';

import { EmailService } from './services/emails/sender';
import { EmailValidationService } from './services/emails/validation';
import { NotificationService } from './services/emails/notification';
import { ForecastFetchingService } from './services/forecast/fetching';
import { ForecastHandlingService } from './services/forecast/handling';
import { ForecastService } from './services/forecast/forecast.service';
import { SubscriptionService } from './services/subscription/subscription.service';
import { CurrentWeatherService } from './services/weather/current';
import { SchedulerService } from './services/emails/scheduler';

import { SubscriptionRepository } from './repositories/subscription-repository';

import { SubscriptionModel } from './database/models/subscription.model';
import { FrequencyModel } from './database/models/frequency.model';

import { DatabaseLoader } from './loaders/database.loader';
import { EmailSchedulerLoader } from './loaders/email-scheduler.loader';

@Module({
   imports: [ConfigModule.forRoot({ isGlobal: true })],
   controllers: [SubscriptionController, WeatherController],
   providers: [
      EmailService,
      EmailValidationService,
      NotificationService,
      ForecastFetchingService,
      ForecastHandlingService,
      ForecastService,
      CurrentWeatherService,
      SchedulerService,
      DatabaseLoader,
      EmailSchedulerLoader,
      {
         provide: SubscriptionRepository,
         useFactory: () =>
            new SubscriptionRepository(
               // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
               SubscriptionModel as any,
               // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
               FrequencyModel as any,
            ),
      },
      SubscriptionService,
   ],
})
export class AppModule {}
