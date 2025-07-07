import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { TimeUnits } from '../../shared/constants/time-units';

@Injectable()
export class CacheService {
   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

   async getData<T>(key: string): Promise<T | undefined> {
      return await this.cacheManager.get<T>(key);
   }

   async setData(key: string, value: unknown, ttl: number = TimeUnits.MINUTE * 10) {
      await this.cacheManager.set(key, value, ttl);
   }
}
