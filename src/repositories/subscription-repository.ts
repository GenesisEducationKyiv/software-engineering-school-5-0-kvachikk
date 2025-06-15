import { Injectable } from '@nestjs/common';

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

   async findByEmail(email: string): Promise<any> {
      return this.subscriptionModel.findOne({ where: { email } });
   }

   async findByToken(verificationToken: string): Promise<any> {
      return this.subscriptionModel.findOne({ where: { verificationToken } });
   }

   async findFrequencyByTitle(title: string): Promise<any> {
      return this.frequencyModel.findOne({
         where: { title: title.toUpperCase() },
      });
   }

   async create(subscriptionData: ISubscriptionData): Promise<any> {
      return this.subscriptionModel.create(subscriptionData);
   }

   async save(subscriptionInstance: ISubscriptionInstance): Promise<any> {
      return subscriptionInstance.save();
   }

   async getActiveSubscriptionsByFrequency(
      frequencyTitle: string,
   ): Promise<any[]> {
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
