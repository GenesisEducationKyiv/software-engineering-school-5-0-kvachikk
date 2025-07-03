import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CacheTTL } from '../constants/cache-ttl';
import { CACHE_METRICS, CacheMetrics } from '../metrics/metrics.module';

@Injectable()
export class MonitoredCacheService {
   constructor(
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      @Inject(CACHE_METRICS) private readonly metrics: CacheMetrics,
   ) {}

   private recordLatency(start: [number, number]) {
      const diff = process.hrtime(start);
      const seconds = diff[0] + diff[1] / 1e9;
      this.metrics.latencyHistogram.observe(seconds);
   }

   async getData<T>(key: string): Promise<T | undefined> {
      const start = process.hrtime();
      const data = await this.cacheManager.get<T>(key);
      this.recordLatency(start);

      if (data !== undefined && data !== null) {
         this.metrics.hitCounter.inc();
      } else {
         this.metrics.missCounter.inc();
      }

      return data ?? undefined;
   }

   async setData<T>(key: string, value: T, ttl: number = CacheTTL.TEN_MINUTE) {
      const start = process.hrtime();
      await this.cacheManager.set(key, value, ttl);
      this.recordLatency(start);
      this.metrics.setCounter.inc();
   }

   async delData(key: string) {
      const start = process.hrtime();
      await this.cacheManager.del(key);
      this.recordLatency(start);
      this.metrics.evictionCounter.inc();
   }
}
