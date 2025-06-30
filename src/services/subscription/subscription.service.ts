import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { ConflictError } from '../../constants/errors/conflict.error';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { subscriptionResponseMessages } from '../../constants/message/subscription-responses';
import { SubscriptionModel } from '../../database/models/subscription.model';
import { SubscriptionRepository } from '../../repositories/subscription.repository';
import { Subscription } from '../../types/subscription';
import { EmailerService } from '../emailer.service';
import { WeatherService } from '../weather.service';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly subscriptionRepository: SubscriptionRepository,
      private readonly emailer: EmailerService,
      private readonly weatherServices: WeatherService,
   ) {}

   private generateToken(): string {
      return randomBytes(32).toString('hex');
   }

   async subscribe(email: string, city: string, frequency: string): Promise<Subscription> {
      const freqUpper = frequency.toUpperCase();

      const allowedFrequencies = Object.values(SubscriptionModel.FREQUENCIES) as string[];
      if (!allowedFrequencies.includes(freqUpper)) {
         throw new NotFoundError(`Frequency: "${frequency}" not supported`);
      }

      await this.weatherServices.getWeatherForecast(city);

      const subscription = await this.subscriptionRepository.findByEmail(email);
      if (subscription) {
         throw new ConflictError(subscriptionResponseMessages.SUBSCRIPTION_ALREADY_EXISTS);
      }

      const token = this.generateToken();

      const newSubscription: Subscription = await this.subscriptionRepository.create({
         email: email.toUpperCase(),
         city: city.toUpperCase(),
         frequency: freqUpper,
         verificationToken: token,
         isVerified: false,
         isActive: false,
      });

      await this.emailer.sendWelcomeEmail(email, city, token);
      return newSubscription;
   }

   async confirmSubscription(token: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription with token: "${token}" not found`);
      }

      subscription.isActive = true;
      subscription.isVerified = true;

      await Promise.all([
         await this.subscriptionRepository.save(subscription),
         await this.emailer.sendConfirmationEmail(subscription.email, subscription.city, token),
      ]);
   }

   async unsubscribe(token: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findByToken(token);
      if (subscription == null) {
         throw new NotFoundError(`Subscription with token: "${token}" not found`);
      }

      subscription.isActive = false;

      await Promise.all([
         this.subscriptionRepository.save(subscription),
         this.emailer.sendUnsubscribeEmail(subscription.email, subscription.city, token),
      ]);
   }

   async getActiveSubscriptions(frequencyTitle: string): Promise<Subscription[]> {
      return await this.subscriptionRepository.getActiveSubscriptionsByFrequency(frequencyTitle);
   }
}
