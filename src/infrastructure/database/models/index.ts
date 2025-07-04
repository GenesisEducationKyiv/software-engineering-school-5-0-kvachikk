import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SubscriptionModel } from './subscription.model';

@Module({
   imports: [SequelizeModule.forFeature([SubscriptionModel])],
   exports: [SequelizeModule],
})
export class ModelsModule {}
