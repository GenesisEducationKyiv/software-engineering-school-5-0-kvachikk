import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionClient } from './clients/subscription.client';
import { WeatherClient } from './clients/weather.client';
import { SubscriptionGatewayController } from './controllers/subscription.controller';
import { WeatherGatewayController } from './controllers/weather.controller';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [
    AppController,
    WeatherGatewayController,
    SubscriptionGatewayController,
  ],
  providers: [AppService, WeatherClient, SubscriptionClient],
})
export class AppModule {}
