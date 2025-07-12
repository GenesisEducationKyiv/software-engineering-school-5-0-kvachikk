import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherClient } from './clients/weather.client';
import { SubscriptionClient } from './clients/subscription.client';
import { WeatherGatewayController } from './controllers/weather.controller';
import { SubscriptionGatewayController } from './controllers/subscription.controller';

@Module({
  imports: [],
  controllers: [AppController, WeatherGatewayController, SubscriptionGatewayController],
  providers: [AppService, WeatherClient, SubscriptionClient],
})
export class AppModule {}
