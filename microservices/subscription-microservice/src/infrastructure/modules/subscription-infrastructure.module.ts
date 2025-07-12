import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';

import { EmailSenderPort } from '../../application/ports/email-sender.port';
import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { WeatherDataProviderPort } from '../../application/ports/weather-data-provider.port';
import { SubscriptionModel } from '../database/models/subscription.model';
import { DatabaseLoader } from '../loaders/database.loader';
import { GrpcEmailerSender } from '../providers/grpc-emailer-sender';
import { GrpcWeatherProvider } from '../providers/grpc-weather-provider';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Global()
@Module({
   imports: [HttpModule],
   providers: [
      DatabaseLoader,
      {
         provide: SubscriptionRepositoryPort,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
      {
         provide: WeatherDataProviderPort,
         useClass: GrpcWeatherProvider,
      },
      {
         provide: EmailSenderPort,
         useClass: GrpcEmailerSender,
      },
   ],
   exports: [SubscriptionRepositoryPort, WeatherDataProviderPort, EmailSenderPort],
})
export class SubscriptionInfrastructureModule {}
