import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { FileLogger, AppLogger } from '../../shared/logger/logger.service';
import { LOGGER } from '../../shared/tokens/logger.token';
import { ApplicationConfigProvider } from '../config/application.config';
import { databaseConfig, DatabaseConfigProvider } from '../config/database.config';
import { MailConfigProvider } from '../config/mail.config';
import { SubscriptionModel } from '../database/models/subscription.model';
import { SubscriptionRepository } from '../repositories/subscription.repository';

import { MetricsModule } from './metrics.module';

@Module({
   imports: [
      SequelizeModule.forRoot({
         dialect: databaseConfig.current.dialect as any,
         storage: databaseConfig.current.storage,
         autoLoadModels: true,
         synchronize: false,
         logging: databaseConfig.current.logging,
         dialectOptions: databaseConfig.current.dialectOptions,
         pool: databaseConfig.current.pool,
      }),
      SequelizeModule.forFeature([SubscriptionModel]),
      MetricsModule,
   ],
   providers: [
      FileLogger,
      {
         provide: LOGGER,
         useClass: AppLogger,
      },
      DatabaseConfigProvider,
      ApplicationConfigProvider,
      MailConfigProvider,
      {
         provide: SubscriptionRepositoryPort,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
   ],
   exports: [SubscriptionRepositoryPort, DatabaseConfigProvider, ApplicationConfigProvider, MailConfigProvider, LOGGER],
})
export class EmailerInfrastructureModule {}
