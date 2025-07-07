import { Global, Module } from '@nestjs/common';
import { Counter, Histogram, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const CACHE_METRICS = 'CACHE_METRICS';

export interface CacheMetrics {
   hitCounter: Counter;
   missCounter: Counter;
   setCounter: Counter;
   evictionCounter: Counter;
   latencyHistogram: Histogram;
}

@Global()
@Module({
   providers: [
      {
         provide: CACHE_METRICS,
         useFactory: (): CacheMetrics => {
            const hitCounter = new Counter({
               name: 'cache_hit_total',
               help: 'Total number of cache hits',
            });

            const missCounter = new Counter({
               name: 'cache_miss_total',
               help: 'Total number of cache misses',
            });

            const setCounter = new Counter({
               name: 'cache_set_total',
               help: 'Total number of cache sets',
            });

            const evictionCounter = new Counter({
               name: 'cache_evictions_total',
               help: 'Total number of cache evictions',
            });

            const latencyHistogram = new Histogram({
               name: 'cache_latency_seconds',
               help: 'Latency for cache operations in seconds',
               buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2],
            });

            return {
               hitCounter,
               missCounter,
               setCounter,
               evictionCounter,
               latencyHistogram,
            };
         },
      },
   ],
   exports: [CACHE_METRICS],
})
export class MetricsModule {}
