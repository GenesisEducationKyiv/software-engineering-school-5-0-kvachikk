import { sequelize } from '../sequelize';
import { FrequencyModel } from '../models/frequency.model';
import { SubscriptionModel } from '../models/subscription.model';

export const testConnection = async (): Promise<void> => {
   // Register models with Sequelize (sequelize-typescript)
   sequelize.addModels([FrequencyModel, SubscriptionModel]);
   await sequelize.authenticate();
};
