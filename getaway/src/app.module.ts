import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionClient } from './clients/subscription.client';
import { WeatherClient } from './clients/weather.client';
import { SubscriptionGatewayController } from './controllers/subscription.controller';
import { WeatherGatewayController } from './controllers/weather.controller';
import { LoggerModule } from './logger/logger.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [LoggerModule, MetricsModule],
  controllers: [
    AppController,
    WeatherGatewayController,
    SubscriptionGatewayController,
  ],
  providers: [
    AppService,
    WeatherClient,
    SubscriptionClient,
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
})
export class AppModule {}
