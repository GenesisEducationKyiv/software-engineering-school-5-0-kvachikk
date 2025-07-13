import { Injectable } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { CreateSubscriptionPayload } from '../../domain/types/payloads/create-subscription.payload';
import { Subscription } from '../../domain/types/subscription';
import { SubscriptionModel } from '../database/models/subscription.model';

@Injectable()
export class SubscriptionRepository extends SubscriptionRepositoryPort {
   constructor(private readonly subscriptionModel: typeof SubscriptionModel) {
      super();
   }

   private toDomain(model: SubscriptionModel): Subscription {
      const { id, email, city, verificationToken, isVerified, isActive } = model;
      return { id, email, city, verificationToken, isVerified, isActive };
   }

   private async getModelById(id: number | undefined): Promise<SubscriptionModel | null> {
      if (id == null) return null;
      return this.subscriptionModel.findByPk(id);
   }

   async create(payload: Partial<CreateSubscriptionPayload>): Promise<Subscription> {
      const normalised: Partial<SubscriptionModel> = { ...payload } as Partial<SubscriptionModel>;

      if (normalised.email) normalised.email = normalised.email.toUpperCase();
      if (normalised.city) normalised.city = normalised.city.toUpperCase();
      if (normalised.frequency) normalised.frequency = (normalised.frequency as string).toUpperCase();

      const created = await this.subscriptionModel.create(normalised);
      return this.toDomain(created);
   }

   async save(instance: Subscription): Promise<Subscription> {
      if (instance.id == null) {
         throw new Error('Cannot save Subscription without id');
      }

      const model = await this.getModelById(instance.id);
      if (!model) {
         throw new Error(`Subscription with id ${instance.id} not found`);
      }

      model.set({
         isVerified: instance.isVerified,
         isActive: instance.isActive,
         email: instance.email.toUpperCase(),
         city: instance.city.toUpperCase(),
         verificationToken: instance.verificationToken,
      });

      await model.save();
      return this.toDomain(model);
   }

   async delete(instance: Subscription): Promise<void> {
      if (instance.id == null) return;
      const model = await this.getModelById(instance.id);
      if (model) await model.destroy();
   }

   async findByToken(verificationToken: string): Promise<Subscription | null> {
      const model = await this.subscriptionModel.findOne({ where: { verificationToken } });
      return model ? this.toDomain(model) : null;
   }

   async findByEmail(email: string): Promise<Subscription | null> {
      const model = await this.subscriptionModel.findOne({ where: { email: email.toUpperCase() } });
      return model ? this.toDomain(model) : null;
   }

   async getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<Subscription[]> {
      const models = await this.subscriptionModel.findAll({
         where: {
            isActive: true,
            isVerified: true,
            frequency: frequencyTitle.toUpperCase(),
         },
      });
      return models.map((m) => this.toDomain(m));
   }
}
