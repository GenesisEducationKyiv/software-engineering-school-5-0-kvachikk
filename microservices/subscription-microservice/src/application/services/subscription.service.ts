import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { ConflictError } from '../../domain/errors/conflict.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { Subscription } from '../../domain/types/subscription';
import { SUBSCRIPTION_FREQUENCIES } from '../../shared/constants/subscription-frequency';
import { subscriptionResponseMessages } from '../../shared/constants/subscription-responses';
import { SubscriptionRepositoryPort } from '../ports/subscription-repository.port';

import { CityValidatorService } from './city-validator.service';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly subscriptionRepository: SubscriptionRepositoryPort,
      private readonly cityValidator: CityValidatorService,
   ) {}

   private async validateCity(city: string): Promise<void> {
      await this.cityValidator.validate(city);
   }

   async subscribe(email: string, city: string, frequency: string): Promise<Subscription> {
      const freqUpper = frequency.toUpperCase();

      const allowedFrequencies = Object.values(SUBSCRIPTION_FREQUENCIES) as string[];
      if (!allowedFrequencies.includes(freqUpper)) {
         throw new NotFoundError(`Frequency: "${frequency}" not supported`);
      }

      await this.validateCity(city);

      const subscription = await this.subscriptionRepository.findByEmail(email);
      if (subscription) {
         throw new ConflictError(subscriptionResponseMessages.SUBSCRIPTION_ALREADY_EXISTS);
      }

      const token = randomBytes(32).toString('hex');

      // TODO: send welcome email via emailer microservice (not implemented yet)

      return this.subscriptionRepository.create({
         email: email.toUpperCase(),
         city: city.toUpperCase(),
         frequency: freqUpper,
         verificationToken: token,
         isVerified: false,
         isActive: false,
      });
   }

   async confirmSubscription(token: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription with token: "${token}" not found`);
      }

      subscription.isActive = true;
      subscription.isVerified = true;

      await this.subscriptionRepository.save(subscription);
      // TODO: send confirmation email
   }

   async unsubscribe(token: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription with token: "${token}" not found`);
      }

      subscription.isActive = false;
      await this.subscriptionRepository.save(subscription);
      // TODO: send unsubscribe email
   }

   async getActiveSubscriptions(frequencyTitle: string): Promise<Subscription[]> {
      return this.subscriptionRepository.getActiveSubscriptionsByFrequency(frequencyTitle);
   }
}
