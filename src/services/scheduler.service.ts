import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SubscriptionModel } from '../database/models/subscription.model';
import { Logger } from '../logger/logger.service';
import { Subscription } from '../types/subscription';

import { EmailerService } from './emailer.service';
import { SubscriptionService } from './subscription/subscription.service';

@Injectable()
export class SchedulerService {
   constructor(
      private readonly emailer: EmailerService,
      private readonly subscriptionService: SubscriptionService,
      private readonly logger: Logger,
   ) {}

   private async processSubscriptions(subscriptions: Subscription[]): Promise<void> {
      if (subscriptions.length === 0) {
         return;
      }

      const sendPromises = subscriptions.map((subscription) => this.emailer.sendForecastEmail(subscription));
      const results = await Promise.allSettled(sendPromises);

      results.forEach((result, index) => {
         if (result.status === 'rejected') {
            const failedSubscription = subscriptions[index];
            this.logger.error(`Failed to send forecast to ${failedSubscription.email}: ${result.reason}`);
         }
      });
   }

   private async handleFrequency(frequency: string): Promise<void> {
      const subscriptions = await this.subscriptionService.getActiveSubscriptions(frequency);
      await this.processSubscriptions(subscriptions);
   }

   @Cron(CronExpression.EVERY_HOUR)
   private async hourlyJob(): Promise<void> {
      await this.handleFrequency(SubscriptionModel.FREQUENCIES.HOURLY);
   }

   @Cron(CronExpression.EVERY_DAY_AT_1PM)
   private async dailyJob(): Promise<void> {
      await this.handleFrequency(SubscriptionModel.FREQUENCIES.DAILY);
   }
}
