import { Injectable } from '@nestjs/common';
import { INTERVALS } from '../../constants/intervals';
import { FREQUENCIES } from '../../constants/frequencies';
import { EmailService } from './sender';
import { Subscription } from '../../interfaces/Subscription';

interface ISubscriptionService {
   getActiveSubscriptions(frequency: string): Promise<Subscription[]>;
}

type FrequencyHandler = (subscriptionService: ISubscriptionService) => Promise<void>;

@Injectable()
export class SchedulerService {
   constructor(private readonly emailService: EmailService) {}

   private async processSubscriptions(subscriptions: Subscription[]): Promise<void> {
      if (subscriptions.length === 0) {
         return;
      }
      const sendPromises = subscriptions.map((subscription) => this.emailService.sendForecastEmail(subscription));
      const results = await Promise.allSettled(sendPromises);

      results.forEach((result, index) => {
         if (result.status === 'rejected') {
            const failedSubscription = subscriptions[index];
            console.error(`Failed to send forecast to ${failedSubscription.email}:`, result.reason);
         }
      });
   }

   private readonly FREQUENCY_HANDLERS: Record<string, FrequencyHandler> = {
      HOURLY: async (subscriptionService: ISubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(FREQUENCIES.HOURLY);
         await this.processSubscriptions(subscriptions);
      },
      DAILY: async (subscriptionService: ISubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(FREQUENCIES.DAILY);
         await this.processSubscriptions(subscriptions);
      },
   };

   private async createScheduler(
      handler: FrequencyHandler,
      interval: number,
      subscriptionService: ISubscriptionService,
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

   async startScheduler(subscriptionService: ISubscriptionService): Promise<void> {
      for (const handlerKey of Object.keys(this.FREQUENCY_HANDLERS)) {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await this.createScheduler(this.FREQUENCY_HANDLERS[handlerKey], INTERVALS[handlerKey], subscriptionService);
      }
   }
}
