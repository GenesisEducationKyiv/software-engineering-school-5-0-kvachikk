import { Injectable } from '@nestjs/common';

import { SubscriptionRepositoryPort } from '../../application/ports/subscription-repository.port';
import { BadRequestError } from '../../domain/errors/bad-request.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { CreateSubscriptionPayload } from '../../domain/types/payloads/create-subscription.payload';
import { Subscription } from '../../domain/types/subscription';
import { SubscriptionModel } from '../database/models/subscription.model';

@Injectable()
export class SubscriptionRepository extends SubscriptionRepositoryPort {
   constructor(private readonly subscriptionModel: typeof SubscriptionModel = SubscriptionModel) {
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
      const normalized: Partial<SubscriptionModel> = { ...payload } as Partial<SubscriptionModel>;

      if (normalized.email) normalized.email = normalized.email.toUpperCase();
      if (normalized.city) normalized.city = normalized.city.toUpperCase();
      if (normalized.frequency) normalized.frequency = (normalized.frequency as string).toUpperCase();

      const created = await this.subscriptionModel.create(normalized);
      return this.toDomain(created);
   }

   async save(instance: Subscription): Promise<Subscription> {
      if (instance.id == null) {
         throw new BadRequestError('Subscription id is required');
      }

      const model = await this.getModelById(instance.id);
      if (!model) {
         throw new NotFoundError(`Subscription with id ${instance.id} not found`);
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
