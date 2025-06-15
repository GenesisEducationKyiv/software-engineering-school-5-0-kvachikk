import { Injectable, OnModuleInit } from '@nestjs/common';

import { SchedulerService } from '../services/emails/scheduler';
import { SubscriptionService } from '../services/subscription/subscription.service';

@Injectable()
export class EmailSchedulerLoader implements OnModuleInit {
   constructor(
      private readonly schedulerService: SchedulerService,
      private readonly subscriptionService: SubscriptionService,
   ) {}

   async onModuleInit(): Promise<void> {
      await this.schedulerService.startScheduler(this.subscriptionService);
   }
}
