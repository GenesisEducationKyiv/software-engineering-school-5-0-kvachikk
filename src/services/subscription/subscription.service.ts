import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { SubscriptionRepository } from '../../repositories/subscription-repository';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { ConflictError } from '../../constants/errors/conflict.error';
import { NotificationService } from '../emails/notification';
import { ForecastFetchingService } from '../forecast/fetching';
import { subscriptionResponseMessages } from '../../constants/message/subscription-responses';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly repository: SubscriptionRepository,
      private readonly notifier: NotificationService,
      private readonly weatherService: ForecastFetchingService,
   ) {}

   private generateToken(): string {
      return randomBytes(32).toString('hex');
   }

   async subscribe(email: string, city: string, frequency: string): Promise<any> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const frequencyEntity = await this.repository.findFrequencyByTitle(frequency);

      await this.weatherService.fetchRawForecast(city);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const existing = await this.repository.findByEmail(email);
      if (existing) {
         throw new ConflictError(subscriptionResponseMessages.SUBSCRIPTION_ALREADY_EXISTS);
      }

      const token = this.generateToken();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const newSubscription = await this.repository.create({
         email,
         city,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
         frequencyId: frequencyEntity.id,
         verificationToken: token,
         isVerified: false,
         isActive: false,
      });

      await this.notifier.sendWelcomeEmail(email, city, token);

      return newSubscription;
   }

   async confirmSubscription(token: string): Promise<any> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      subscription.isActive = true;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      subscription.isVerified = true;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.repository.save(subscription);

      await this.notifier.sendConfirmationEmail(
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
         subscription.email,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
         subscription.city,
         token,
      );

      return subscription;
   }

   async unsubscribe(token: string): Promise<any> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      subscription.isActive = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.repository.save(subscription);

      await this.notifier.sendUnsubscribeEmail(
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
         subscription.email,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
         subscription.city,
         token,
      );

      return subscription;
   }

   async getActiveSubscriptions(frequencyTitle: string): Promise<any[]> {
      if (!frequencyTitle) {
         throw new NotFoundError(frequencyTitle);
      }
      return this.repository.getActiveSubscriptionsByFrequency(frequencyTitle);
   }
}
