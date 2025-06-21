import { Injectable } from '@nestjs/common';
import { Subscription } from '../interfaces/Subscription';
import { FrequencyModel } from '../database/models/frequency.model';

interface SubscriptionModel {
   findOne(options: any): Promise<any>;
   findAll(options: any): Promise<any[]>;
   create(data: any): Promise<any>;
}

interface FrequencyInterface {
   findOne(options: any): Promise<any>;
}

interface SubscriptionData {
   email: string;
   city: string;
   verificationToken: string;
   frequencyId: number;
   isActive?: boolean;
   isVerified?: boolean;
}

interface SubscriptionInstance {
   save(): Promise<any>;
}

@Injectable()
export class SubscriptionRepository {
   constructor(
      private readonly subscriptionModel: SubscriptionModel,
      private readonly frequencyModel: FrequencyInterface,
   ) {}

   private getModel(model: 'subscription' | 'frequency'): SubscriptionModel | FrequencyInterface {
      return model === 'subscription' ? this.subscriptionModel : this.frequencyModel;
   }

   async find(model: 'subscription' | 'frequency', whereClause: Record<string, unknown>): Promise<any> {
      const targetModel = this.getModel(model);
      return targetModel.findOne({ where: whereClause });
   }

   async findByEmail(email: string): Promise<Subscription> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.find('subscription', { email });
   }

   async findByToken(verificationToken: string): Promise<any> {
      return this.find('subscription', { verificationToken });
   }

   async findFrequencyByTitle(title: string): Promise<FrequencyModel> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.find('frequency', { title: title.toUpperCase() });
   }

   async create(subscriptionData: SubscriptionData): Promise<any> {
      return this.subscriptionModel.create(subscriptionData);
   }

   async save(subscriptionInstance: SubscriptionInstance): Promise<any> {
      return subscriptionInstance.save();
   }

   async getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<any[]> {
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
