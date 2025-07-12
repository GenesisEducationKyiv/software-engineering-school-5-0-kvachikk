import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Subscription } from '../../domain/types/subscription';
import { SUBSCRIPTION_FREQUENCIES } from '../../shared/constants/subscription-frequency';
import { SubscriptionRepositoryPort } from '../ports/subscription-repository.port';

import { EmailerService } from './emailer.service';

@Injectable()
export class SchedulerService {
   constructor(
      private readonly emailer: EmailerService,
      private readonly subscriptionRepository: SubscriptionRepositoryPort,
   ) {}

   @Cron(CronExpression.EVERY_HOUR)
   private async hourlyJob(): Promise<void> {
      await this.handleFrequency(SUBSCRIPTION_FREQUENCIES.HOURLY);
   }

   @Cron(CronExpression.EVERY_DAY_AT_1PM)
   private async dailyJob(): Promise<void> {
      await this.handleFrequency(SUBSCRIPTION_FREQUENCIES.DAILY);
   }

   private async handleFrequency(frequency: string): Promise<void> {
      const subscriptions = await this.subscriptionRepository.getActiveSubscriptionsByFrequency(frequency);
      await this.processSubscriptions(subscriptions);
   }

   private async processSubscriptions(subscriptions: Subscription[]): Promise<void> {
      if (subscriptions.length === 0) return;

      const sendPromises = subscriptions.map((s) => this.emailer.sendForecastEmail(s));
      await Promise.allSettled(sendPromises);
   }
}
