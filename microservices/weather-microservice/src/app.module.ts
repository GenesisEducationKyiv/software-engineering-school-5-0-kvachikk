import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApplicationModule } from './application/application.module';
import { RedisConfig } from './infrastructure/config/redis.config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      CacheModule.registerAsync(RedisConfig),
      HttpModule,
      ApplicationModule,
      InfrastructureModule,
      PresentationModule,
   ],
   controllers: [],
   providers: [],
})
export class AppModule {}
