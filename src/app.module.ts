import { join } from 'node:path';

import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { MetricsModule } from './application/modules/metrics.module';
import { RedisConfig } from './infrastructure/config/redis.config';
import { DatabaseLoader } from './infrastructure/loaders/database.loader';
import { SubscriptionInfrastructureModule } from './infrastructure/modules/subscription-infrastructure.module';
import { WeatherInfrastructureModule } from './infrastructure/modules/weather-infrastructure.module';
import { MetricsPresentationModule } from './presentation/modules/metrics-presentation.module';
import { SubscriptionPresentationModule } from './presentation/modules/subscription-presentation.module';
import { WeatherPresentationModule } from './presentation/modules/weather-presentation.module';

@Module({
   imports: [
      ServeStaticModule.forRoot({
         rootPath: join(__dirname, '..', 'public'),
         serveRoot: '/public',
      }),
      ConfigModule.forRoot({ isGlobal: true }),
      CacheModule.registerAsync(RedisConfig),
      HttpModule,
      MetricsModule,
      WeatherInfrastructureModule,
      SubscriptionInfrastructureModule,
      WeatherPresentationModule,
      SubscriptionPresentationModule,
      MetricsPresentationModule,
   ],
   controllers: [],
   providers: [DatabaseLoader],
})
export class AppModule {}
