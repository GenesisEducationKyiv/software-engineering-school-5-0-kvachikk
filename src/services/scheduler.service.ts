import { Injectable } from '@nestjs/common';

import { FREQUENCIES } from '../constants/frequencies';
import { INTERVALS } from '../constants/intervals';
import { Subscription } from '../interfaces/Subscription';

import { EmailerService } from './emailer.service';

interface SubscriptionService {
   getActiveSubscriptions(frequency: string): Promise<Subscription[]>;
}

type FrequencyHandler = (subscriptionService: SubscriptionService) => Promise<void>;

@Injectable()
export class SchedulerService {
   constructor(private readonly emailer: EmailerService) {}

   private async processSubscriptions(subscriptions: Subscription[]): Promise<void> {
      if (subscriptions.length === 0) {
         return;
      }

      const sendPromises = subscriptions.map((subscription) => this.emailer.sendForecastEmail(subscription));
      const results = await Promise.allSettled(sendPromises);

      results.forEach((result, index) => {
         if (result.status === 'rejected') {
            const failedSubscription = subscriptions[index];
            console.error(`Failed to send forecast to ${failedSubscription.email}:`, result.reason);
         }
      });
   }

   private readonly FREQUENCY_HANDLERS: Record<string, FrequencyHandler> = {
      HOURLY: async (subscriptionService: SubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(FREQUENCIES.HOURLY);
         await this.processSubscriptions(subscriptions);
      },
      DAILY: async (subscriptionService: SubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(FREQUENCIES.DAILY);
         await this.processSubscriptions(subscriptions);
      },
   };

   private async createScheduler(
      handler: FrequencyHandler,
      interval: number,
      subscriptionService: SubscriptionService,
   ): Promise<void> {
      const run = async (): Promise<void> => {
         try {
            await handler(subscriptionService);
         } catch (error) {
            console.error('Error during scheduled task execution:', error);
         } finally {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(run, interval);
         }
      };
      await run();
   }

   async startScheduler(subscriptionService: SubscriptionService): Promise<void> {
      for (const handlerKey of Object.keys(this.FREQUENCY_HANDLERS)) {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await this.createScheduler(this.FREQUENCY_HANDLERS[handlerKey], INTERVALS[handlerKey], subscriptionService);
      }
   }
}
