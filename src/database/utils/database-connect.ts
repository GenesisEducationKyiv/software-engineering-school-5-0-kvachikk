import { SubscriptionModel } from '../models/subscription.model';
import { sequelize } from '../sequelize';

export const testConnection = async (): Promise<void> => {
   sequelize.addModels([SubscriptionModel]);
   await sequelize.authenticate();
   await sequelize.sync();
};
