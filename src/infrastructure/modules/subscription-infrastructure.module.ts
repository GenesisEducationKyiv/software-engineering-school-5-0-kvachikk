import { Global, Module } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { ApplicationConfigProvider } from '../config/application.config';
import { MailConfigProvider } from '../config/mail.config';
import { SubscriptionModel } from '../database/models/subscription.model';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Global()
@Module({
   imports: [],
   providers: [
      ApplicationConfigProvider,
      MailConfigProvider,
      {
         provide: SubscriptionRepositoryPort,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
   ],
   exports: [SubscriptionRepositoryPort, ApplicationConfigProvider, MailConfigProvider],
})
export class SubscriptionInfrastructureModule {}
