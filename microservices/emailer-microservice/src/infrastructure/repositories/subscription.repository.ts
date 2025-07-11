import { Injectable } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { Subscription } from '../../domain/types/subscription';
import { SubscriptionModel } from '../database/models/subscription.model';

@Injectable()
export class SubscriptionRepository extends SubscriptionRepositoryPort {
   constructor(private readonly subscriptionModel: typeof SubscriptionModel) {
      super();
   }

   private toDomain(model: SubscriptionModel): Subscription {
      const plain = (model as any).get({ plain: true }) as any;
      const { id, email, city, verificationToken, isVerified, isActive, frequency } = plain;
      return { id, email, city, verificationToken, isVerified, isActive, frequency };
   }

   async getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<Subscription[]> {
      const models = await (this.subscriptionModel as any).findAll({
         where: {
            isActive: true,
            isVerified: true,
            frequency: frequencyTitle.toUpperCase(),
         },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return models.map((m: any) => this.toDomain(m));
   }
}
