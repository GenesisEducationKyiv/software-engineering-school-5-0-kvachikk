import { Injectable } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { SubscriptionModel } from '../database/models/subscription.model';

@Injectable()
export class SubscriptionRepository extends SubscriptionRepositoryPort {
   constructor(private readonly subscriptionModel: typeof SubscriptionModel) {
      super();
   }

   async create(payload: Partial<SubscriptionModel>): Promise<SubscriptionModel> {
      const normalised: Partial<SubscriptionModel> = { ...payload };

      if (normalised.email) {
         normalised.email = normalised.email.toUpperCase();
      }

      if (normalised.city) {
         normalised.city = normalised.city.toUpperCase();
      }

      if (normalised.frequency) {
         normalised.frequency = normalised.frequency.toUpperCase();
      }

      return this.subscriptionModel.create(normalised);
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
      return this.subscriptionModel.findOne({ where: { email: email.toUpperCase() } });
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
