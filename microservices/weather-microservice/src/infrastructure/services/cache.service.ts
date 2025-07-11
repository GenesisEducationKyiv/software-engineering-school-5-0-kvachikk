import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CachePort } from '../../application/ports/cache-service.port';
import { DEFAULT_CACHE_TTL } from '../../shared/constants/cache.constants';

@Injectable()
export class CacheService implements CachePort {
   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

   async getData<T>(key: string): Promise<T | undefined> {
      return await this.cacheManager.get<T>(key);
   }

   async setData(key: string, value: unknown, ttl: number = DEFAULT_CACHE_TTL) {
      await this.cacheManager.set(key, value, ttl);
   }
}
