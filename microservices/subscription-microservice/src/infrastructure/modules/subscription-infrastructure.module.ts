import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { WeatherDataProviderPort } from '../../application/ports/weather-data-provider.port';
import { SubscriptionModel } from '../database/models/subscription.model';
import { DatabaseLoader } from '../loaders/database.loader';
import { ApiWeatherProvider } from '../providers/api-weather-provider';
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
         useClass: ApiWeatherProvider,
      },
   ],
   exports: [SubscriptionRepositoryPort, WeatherDataProviderPort],
})
export class SubscriptionInfrastructureModule {}
