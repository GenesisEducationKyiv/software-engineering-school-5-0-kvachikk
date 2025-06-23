import { Injectable } from '@nestjs/common';

import { FrequencyModel } from '../database/models/frequency.model';
import { SubscriptionModel } from '../database/models/subscription.model';

type SubscriptionStatic = typeof SubscriptionModel;
type FrequencyStatic = typeof FrequencyModel;

interface FindableModel {
   findOne(options: { where: Record<string, unknown> }): Promise<unknown>;
}

@Injectable()
export class SubscriptionRepository {
   constructor(
      private readonly subscriptionModel: SubscriptionStatic,
      private readonly frequencyModel: FrequencyStatic,
   ) {}

   private getModel(model: 'subscription' | 'frequency'): SubscriptionStatic | FrequencyStatic {
      return model === 'subscription' ? this.subscriptionModel : this.frequencyModel;
   }

   private async find<T>(model: 'subscription' | 'frequency', whereClause: Record<string, unknown>): Promise<T | null> {
      const targetModel = this.getModel(model) as FindableModel;
      return (await targetModel.findOne({ where: whereClause })) as T | null;
   }

   async findByEmail(email: string): Promise<SubscriptionModel | null> {
      return this.find<SubscriptionModel>('subscription', { email });
   }

   async findByToken(verificationToken: string): Promise<SubscriptionModel | null> {
      return this.find<SubscriptionModel>('subscription', { verificationToken });
   }

   async create(subscription: Partial<SubscriptionModel>): Promise<SubscriptionModel> {
      return this.subscriptionModel.create(subscription);
   }

   async save(subscriptionInstance: SubscriptionModel): Promise<SubscriptionModel> {
      return subscriptionInstance.save();
   }

   async findFrequencyByTitle(title: string): Promise<FrequencyModel | null> {
      return this.find<FrequencyModel>('frequency', { title: title.toUpperCase() });
   }

   async getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<unknown[]> {
      return this.subscriptionModel.findAll({
         where: { isActive: true, isVerified: true },
         include: [
            {
               model: this.frequencyModel,
               as: 'Frequency',
               where: { title: frequencyTitle.toUpperCase() },
            },
         ],
      });
   }
}
