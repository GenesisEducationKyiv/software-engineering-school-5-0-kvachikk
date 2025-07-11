import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CachePort } from '../../application/ports/cache-service.port';
import { DEFAULT_CACHE_TTL } from '../../shared/constants/cache.constants';
import { CACHE_METRICS, CacheMetrics } from '../modules/metrics.module';

import { CacheService } from './cache.service';

@Injectable()
export class MetricsCacheDecorator implements CachePort {
   constructor(
      private readonly inner: CacheService,
      @Optional() @Inject(CACHE_METRICS) private readonly metrics?: CacheMetrics,
   ) {}

   private recordLatency(start: [number, number]) {
      if (!this.metrics) return;
      const diff = process.hrtime(start);
      const seconds = diff[0] + diff[1] / 1e9;
      this.metrics.latencyHistogram.observe(seconds);
   }

   async getData<T>(key: string): Promise<T | undefined> {
      const start = process.hrtime();
      const data = await this.inner.getData<T>(key);
      this.recordLatency(start);

      if (this.metrics) {
         if (data !== undefined && data !== null) {
            this.metrics.hitCounter.inc();
         } else {
            this.metrics.missCounter.inc();
         }
      }
      return data ?? undefined;
   }

   async setData<T>(key: string, value: T, ttl: number = DEFAULT_CACHE_TTL) {
      const start = process.hrtime();
      await this.inner.setData(key, value, ttl);
      this.recordLatency(start);
      this.metrics?.setCounter.inc();
   }
}
