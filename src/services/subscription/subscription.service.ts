import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { ConflictError } from '../../constants/errors/conflict.error';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { subscriptionResponseMessages } from '../../constants/message/subscription-responses';
import { Subscription } from '../../interfaces/Subscription';
import { SubscriptionRepository } from '../../repositories/subscription-repository';
import { EmailerService } from '../emailer.service';
import { WeatherService } from '../weather.service';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly repository: SubscriptionRepository,
      private readonly emailer: EmailerService,
      private readonly weatherServices: WeatherService,
   ) {}

   private generateToken(): string {
      return randomBytes(32).toString('hex');
   }

   async subscribe(email: string, city: string, frequency: string): Promise<Subscription> {
      const frequencyEntity = await this.repository.findFrequencyByTitle(frequency);

      if (!frequencyEntity) {
         throw new NotFoundError(`Frequency: "${frequency}" not found`);
      }

      await this.weatherServices.getWeatherForecast(city);

      const subscription = await this.repository.findByEmail(email);
      if (subscription) {
         throw new ConflictError(subscriptionResponseMessages.SUBSCRIPTION_ALREADY_EXISTS);
      }

      const token = this.generateToken();

      const newSubscription: Subscription = await this.repository.create({
         email,
         city,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         frequencyId: frequencyEntity.id,
         verificationToken: token,
         isVerified: false,
         isActive: false,
      });

      await this.emailer.sendWelcomeEmail(email, city, token);

      return newSubscription;
   }

   async confirmSubscription(token: string): Promise<void> {
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      subscription.isActive = true;
      subscription.isVerified = true;

      await this.repository.save(subscription);
      await this.emailer.sendConfirmationEmail(subscription.email, subscription.city, token);
   }

   async unsubscribe(token: string): Promise<void> {
      const subscription = await this.repository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription: "${token}" not found`);
      }

      subscription.isActive = false;
      await this.repository.save(subscription);
      await this.emailer.sendUnsubscribeEmail(subscription.email, subscription.city, token);
   }

   async getActiveSubscriptions(frequencyTitle: string): Promise<Subscription[]> {
      return (await this.repository.getActiveSubscriptionsByFrequency(frequencyTitle)) as unknown as Subscription[];
   }
}
