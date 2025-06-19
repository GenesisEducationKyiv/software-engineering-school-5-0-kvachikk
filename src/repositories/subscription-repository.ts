import { Injectable } from '@nestjs/common';
import { Subscription } from '../interfaces/Subscription';
import { FrequencyModel } from '../database/models/frequency.model';

interface ISubscriptionModel {
   findOne(options: any): Promise<any>;
   findAll(options: any): Promise<any[]>;
   create(data: any): Promise<any>;
}

interface IFrequencyModel {
   findOne(options: any): Promise<any>;
}

interface ISubscriptionData {
   email: string;
   city: string;
   verificationToken: string;
   frequencyId: number;
   isActive?: boolean;
   isVerified?: boolean;
}

interface ISubscriptionInstance {
   save(): Promise<any>;
}

@Injectable()
export class SubscriptionRepository {
   constructor(
      private readonly subscriptionModel: ISubscriptionModel,
      private readonly frequencyModel: IFrequencyModel,
   ) {}

   private getModel(model: 'subscription' | 'frequency'): ISubscriptionModel | IFrequencyModel {
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

   async create(subscriptionData: ISubscriptionData): Promise<any> {
      return this.subscriptionModel.create(subscriptionData);
   }

   async save(subscriptionInstance: ISubscriptionInstance): Promise<any> {
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
