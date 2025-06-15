import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FrequencyModel } from './frequency.model';
import { SubscriptionModel } from './subscription.model';

@Module({
   imports: [SequelizeModule.forFeature([FrequencyModel, SubscriptionModel])],
   exports: [SequelizeModule],
})
export class ModelsModule {}
