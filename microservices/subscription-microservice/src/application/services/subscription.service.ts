import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { ConflictError } from '../../domain/errors/conflict.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { Subscription } from '../../domain/types/subscription';
import { ProducerService } from '../../infrastructure/kafka/producer.service';
import { SUBSCRIPTION_FREQUENCIES } from '../../shared/constants/subscription-frequency';
import { subscriptionResponseMessages } from '../../shared/constants/subscription-responses';
import { SubscriptionRepositoryPort } from '../ports/subscription-repository.port';

import { CityValidatorService } from './city-validator.service';

@Injectable()
export class SubscriptionService {
   constructor(
      private readonly subscriptionRepository: SubscriptionRepositoryPort,
      private readonly cityValidator: CityValidatorService,
      private readonly producerService: ProducerService,
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

      await this.producerService.produce({
         topic: 'emails-welcome',
         messages: [
            {
               value: JSON.stringify({ email, city, token }),
            },
         ],
      });

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

      await this.producerService.produce({
         topic: 'emails-confirm',
         messages: [
            {
               value: JSON.stringify({ email: subscription.email, city: subscription.city }),
            },
         ],
      });
   }

   async unsubscribe(token: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findByToken(token);
      if (!subscription) {
         throw new NotFoundError(`Subscription with token: "${token}" not found`);
      }

      subscription.isActive = false;
      await this.subscriptionRepository.save(subscription);

      await this.producerService.produce({
         topic: 'emails-unsubscribe',
         messages: [
            {
               value: JSON.stringify({ email: subscription.email, city: subscription.city }),
            },
         ],
      });
   }
}
