import { Global, Module } from '@nestjs/common';
import { Counter, Histogram, collectDefaultMetrics } from 'prom-client';

import { MetricsController } from './metrics.controller';

collectDefaultMetrics();

export const REQUEST_METRICS = 'REQUEST_METRICS';

export interface RequestMetrics {
  requestCounter: Counter<string>;
  durationHistogram: Histogram<string>;
}

@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    {
      provide: REQUEST_METRICS,
      useFactory: (): RequestMetrics => {
        const requestCounter = new Counter({
          name: 'gateway_request_total',
          help: 'Total number of HTTP requests',
          labelNames: ['method', 'status'] as const,
        });
        const durationHistogram = new Histogram({
          name: 'gateway_request_duration_seconds',
          help: 'Duration of HTTP requests in seconds',
          buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2],
          labelNames: ['method', 'status'] as const,
        });
        return { requestCounter, durationHistogram };
      },
    },
  ],
  exports: [REQUEST_METRICS],
})
export class MetricsModule {}
