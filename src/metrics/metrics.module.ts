import { Global, Module } from '@nestjs/common';
import { Counter, Histogram, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const CACHE_HIT_COUNTER = 'CACHE_HIT_COUNTER';
export const CACHE_MISS_COUNTER = 'CACHE_MISS_COUNTER';
export const CACHE_SET_COUNTER = 'CACHE_SET_COUNTER';
export const CACHE_EVICTION_COUNTER = 'CACHE_EVICTION_COUNTER';
export const CACHE_LATENCY_HISTOGRAM = 'CACHE_LATENCY_HISTOGRAM';

@Global()
@Module({
   providers: [
      {
         provide: CACHE_HIT_COUNTER,
         useValue: new Counter({
            name: 'cache_hit_total',
            help: 'Total number of cache hits',
         }),
      },
      {
         provide: CACHE_MISS_COUNTER,
         useValue: new Counter({
            name: 'cache_miss_total',
            help: 'Total number of cache misses',
         }),
      },
      {
         provide: CACHE_SET_COUNTER,
         useValue: new Counter({
            name: 'cache_set_total',
            help: 'Total number of cache sets',
         }),
      },
      {
         provide: CACHE_EVICTION_COUNTER,
         useValue: new Counter({
            name: 'cache_evictions_total',
            help: 'Total number of cache evictions',
         }),
      },
      {
         provide: CACHE_LATENCY_HISTOGRAM,
         useValue: new Histogram({
            name: 'cache_latency_seconds',
            help: 'Latency for cache operations in seconds',
            buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2],
         }),
      },
   ],
   exports: [CACHE_HIT_COUNTER, CACHE_MISS_COUNTER, CACHE_SET_COUNTER, CACHE_EVICTION_COUNTER, CACHE_LATENCY_HISTOGRAM],
})
export class MetricsModule {}
