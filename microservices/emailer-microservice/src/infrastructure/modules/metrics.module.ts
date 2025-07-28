import { Global, Module } from '@nestjs/common';
import { Counter, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const EMAIL_METRICS = 'EMAIL_METRICS';

export interface EmailMetrics {
   sentCounter: Counter;
   errorCounter: Counter;
}

@Global()
@Module({
   providers: [
      {
         provide: EMAIL_METRICS,
         useFactory: (): EmailMetrics => {
            const sentCounter = new Counter({
               name: 'emails_sent_total',
               help: 'Total number of emails successfully sent',
            });
            const errorCounter = new Counter({
               name: 'emails_error_total',
               help: 'Total number of email sending errors',
            });
            return { sentCounter, errorCounter };
         },
      },
   ],
   exports: [EMAIL_METRICS],
})
export class MetricsModule {}
