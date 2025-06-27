import 'dotenv/config';

import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisConfig: CacheModuleAsyncOptions = {
   isGlobal: true,
   imports: [ConfigModule],
   useFactory: async () => {
      if (!process.env.REDIS_HOST || process.env.RUN_ENVIROMENT === 'test') {
         return {};
      }

      const store = await redisStore({
         socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6379,
         },
      });

      return {
         store: () => store,
      };
   },
   inject: [ConfigService],
};
