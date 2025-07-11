import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { FileLogger, AppLogger } from '../../shared/logger/logger.service';
import { ApplicationConfigProvider } from '../config/application.config';
import { databaseConfig, DatabaseConfigProvider } from '../config/database.config';
import { MailConfigProvider } from '../config/mail.config';
import { SubscriptionModel } from '../database/models/subscription.model';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Module({
   imports: [
      SequelizeModule.forRoot({
         dialect: 'postgres',
         autoLoadModels: true,
         synchronize: false,
         logging: databaseConfig.current.logging,
         dialectOptions: databaseConfig.current.dialectOptions,
         pool: databaseConfig.current.pool,
      }),
      SequelizeModule.forFeature([SubscriptionModel]),
   ],
   providers: [
      FileLogger,
      AppLogger,
      DatabaseConfigProvider,
      ApplicationConfigProvider,
      MailConfigProvider,
      {
         provide: SubscriptionRepositoryPort,
         useFactory: () => new SubscriptionRepository(SubscriptionModel),
      },
   ],
   exports: [
      SubscriptionRepositoryPort,
      DatabaseConfigProvider,
      ApplicationConfigProvider,
      MailConfigProvider,
      FileLogger,
      AppLogger,
   ],
})
export class EmailerInfrastructureModule {}
