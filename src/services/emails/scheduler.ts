import { Injectable } from '@nestjs/common';
import { INTERVALS } from '../../constants/intervals';
import { FREQUENCIES } from '../../constants/frequencies';
import { EmailService } from './sender';
import { ForecastService } from '../forecast/forecast.service';
import { sendForecasts } from '../forecast/send-forecasts';

interface ISubscriptionService {
   getActiveSubscriptions(frequency: string): Promise<any[]>;
}

type FrequencyHandler = (
   subscriptionService: ISubscriptionService,
) => Promise<void>;

@Injectable()
export class SchedulerService {
   private readonly FREQUENCY_HANDLERS: Record<string, FrequencyHandler> = {
      HOURLY: async (subscriptionService: ISubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(
            FREQUENCIES.HOURLY,
         );
         await sendForecasts(subscriptions, this.forecastService, this.emailService);
      },
      DAILY: async (subscriptionService: ISubscriptionService) => {
         const subscriptions = await subscriptionService.getActiveSubscriptions(
            FREQUENCIES.DAILY,
         );
         await sendForecasts(subscriptions, this.forecastService, this.emailService);
      },
   };

   constructor(
      private readonly forecastService: ForecastService,
      private readonly emailService: EmailService,
   ) {}

   private async createScheduler(
      handler: FrequencyHandler,
      interval: number,
      subscriptionService: ISubscriptionService,
   ): Promise<void> {
      const run = async (): Promise<void> => {
         try {
            await handler(subscriptionService);
         } catch (error) {
            console.error(error);
         } finally {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(run, interval);
         }
      };
      await run();
   }

   async startScheduler(
      subscriptionService: ISubscriptionService,
   ): Promise<void> {
      for (const handler of Object.keys(this.FREQUENCY_HANDLERS)) {
         await this.createScheduler(
            this.FREQUENCY_HANDLERS[handler],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            INTERVALS[handler],
            subscriptionService,
         );
      }
   }
}
