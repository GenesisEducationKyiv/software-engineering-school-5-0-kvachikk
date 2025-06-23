import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { ConflictError } from '../../constants/errors/conflict.error';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { subscriptionResponseMessages } from '../../constants/message/subscription-responses';
import { FrequencyModel } from '../../database/models/frequency.model';
import { SubscriptionModel } from '../../database/models/subscription.model';
import { SubscriptionRepository } from '../../repositories/subscription-repository';
import { NotificationService } from '../emails/notification';
import { WeatherServices } from '../weather/weather.services';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly repository: SubscriptionRepository,
      private readonly notifier: NotificationService,
      private readonly weatherServices: WeatherServices,
   ) {}

   private generateToken(): string {
      return randomBytes(32).toString('hex');
   }

   async subscribe(email: string, city: string, frequency: string): Promise<unknown> {
      const frequencyEntity: FrequencyModel | null = await this.repository.findFrequencyByTitle(frequency);

      if (!frequencyEntity) {
         throw new NotFoundError(`Frequency: "${frequency}" not found`);
      }

      await this.weatherServices.getWeatherForecast(city);

      const subscription = await this.repository.findByEmail(email);
      if (subscription) {
         throw new ConflictError(subscriptionResponseMessages.SUBSCRIPTION_ALREADY_EXISTS);
      }

      const token = this.generateToken();

      const newSubscription: SubscriptionModel = await this.repository.create({
         email,
         city,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         frequencyId: frequencyEntity.id,
         verificationToken: token,
         isVerified: false,
         isActive: false,
      });

      await this.notifier.sendWelcomeEmail(email, city, token);

      return newSubscription;
   }

   async confirmSubscription(token: string): Promise<SubscriptionModel> {
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      subscription.isActive = true;
      subscription.isVerified = true;

      await this.repository.save(subscription);

      await this.notifier.sendConfirmationEmail(subscription.email, subscription.city, token);

      return subscription;
   }

   async unsubscribe(token: string): Promise<void> {
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      subscription.isActive = false;
      await this.repository.save(subscription);
      await this.notifier.sendUnsubscribeEmail(subscription.email, subscription.city, token);
   }

   async getActiveSubscriptions(frequencyTitle: string): Promise<unknown[]> {
      if (!frequencyTitle) {
         throw new NotFoundError(frequencyTitle);
      }
      return this.repository.getActiveSubscriptionsByFrequency(frequencyTitle);
   }
}
