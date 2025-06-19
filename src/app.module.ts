import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherController } from './controllers/weather.controller';

import { EmailService } from './services/emails/sender';
import { EmailValidationService } from './services/emails/validation';
import { NotificationService } from './services/emails/notification';
import { SubscriptionService } from './services/subscription/subscription.service';
import { WeatherServices } from './services/weather/weather.services';
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
      WeatherServices,
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
