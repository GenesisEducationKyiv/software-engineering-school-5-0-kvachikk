import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Counter, Histogram } from 'prom-client';

import { CacheTTL } from '../constants/cache-ttl';
import {
   CACHE_EVICTION_COUNTER,
   CACHE_HIT_COUNTER,
   CACHE_LATENCY_HISTOGRAM,
   CACHE_MISS_COUNTER,
   CACHE_SET_COUNTER,
} from '../metrics/metrics.module';

@Injectable()
export class MonitoredCacheService {
   constructor(
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      @Inject(CACHE_HIT_COUNTER) private readonly cacheHitCounter: Counter,
      @Inject(CACHE_MISS_COUNTER) private readonly cacheMissCounter: Counter,
      @Inject(CACHE_SET_COUNTER) private readonly cacheSetCounter: Counter,
      @Inject(CACHE_EVICTION_COUNTER) private readonly cacheEvictionCounter: Counter,
      @Inject(CACHE_LATENCY_HISTOGRAM) private readonly latencyHistogram: Histogram,
   ) {}

   private recordLatency(start: [number, number]) {
      const diff = process.hrtime(start);
      const seconds = diff[0] + diff[1] / 1e9;
      this.latencyHistogram.observe(seconds);
   }

   async getData<T>(key: string): Promise<T | undefined> {
      const start = process.hrtime();
      const data = await this.cacheManager.get<T>(key);
      this.recordLatency(start);

      if (data !== undefined && data !== null) {
         this.cacheHitCounter.inc();
      } else {
         this.cacheMissCounter.inc();
      }

      return data ?? undefined;
   }

   async setData(key: string, value: unknown, ttl: number = CacheTTL.TEN_MINUTE) {
      const start = process.hrtime();
      if (ttl) {
         await this.cacheManager.set(key, value, ttl);
      } else {
         await this.cacheManager.set(key, value);
      }
      this.recordLatency(start);
      this.cacheSetCounter.inc();
   }

   async delData(key: string) {
      const start = process.hrtime();
      await this.cacheManager.del(key);
      this.recordLatency(start);
      this.cacheEvictionCounter.inc();
   }
}
