import { Injectable } from '@nestjs/common';

import { SubscriptionModel } from '../database/models/subscription.model';

@Injectable()
export class SubscriptionRepository {
   constructor(private readonly subscriptionModel: typeof SubscriptionModel) {}

   async create(payload: Partial<SubscriptionModel>): Promise<SubscriptionModel> {
      return this.subscriptionModel.create(payload);
   }

   async update(instance: SubscriptionModel): Promise<SubscriptionModel> {
      return await instance.save();
   }

   async save(instance: SubscriptionModel): Promise<SubscriptionModel> {
      return instance.save();
   }

   async delete(instance: SubscriptionModel): Promise<void> {
      await instance.destroy();
   }

   async findByToken(verificationToken: string): Promise<SubscriptionModel | null> {
      return this.subscriptionModel.findOne({ where: { verificationToken } });
   }

   async findByEmail(email: string): Promise<SubscriptionModel | null> {
      return this.subscriptionModel.findOne({ where: { email } });
   }

   async getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<SubscriptionModel[]> {
      return this.subscriptionModel.findAll({
         where: {
            isActive: true,
            isVerified: true,
            frequency: frequencyTitle.toUpperCase(),
         },
      });
   }
}
