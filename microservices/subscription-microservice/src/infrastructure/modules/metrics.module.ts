import { Global, Module } from '@nestjs/common';
import { Counter, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const SUBSCRIPTION_METRICS = 'SUBSCRIPTION_METRICS';

export interface SubscriptionMetrics {
   createdCounter: Counter;
   confirmedCounter: Counter;
   unsubscribedCounter: Counter;
}

@Global()
@Module({
   providers: [
      {
         provide: SUBSCRIPTION_METRICS,
         useFactory: (): SubscriptionMetrics => {
            const createdCounter = new Counter({
               name: 'subscription_created_total',
               help: 'Total number of new subscriptions',
            });
            const confirmedCounter = new Counter({
               name: 'subscription_confirmed_total',
               help: 'Total number of confirmed subscriptions',
            });
            const unsubscribedCounter = new Counter({
               name: 'subscription_unsubscribed_total',
               help: 'Total number of unsubscribed users',
            });
            return { createdCounter, confirmedCounter, unsubscribedCounter };
         },
      },
   ],
   exports: [SUBSCRIPTION_METRICS],
})
export class MetricsModule {}
