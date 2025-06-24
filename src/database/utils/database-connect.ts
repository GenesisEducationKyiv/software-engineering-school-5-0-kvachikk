import { FrequencyModel } from '../models/frequency.model';
import { SubscriptionModel } from '../models/subscription.model';
import { sequelize } from '../sequelize';

export const testConnection = async (): Promise<void> => {
   sequelize.addModels([FrequencyModel, SubscriptionModel]);
   await sequelize.authenticate();
};
