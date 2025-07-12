import { join } from 'node:path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';

interface WeatherGrpc {
  GetWeatherForecast(data: { city: string }): Promise<{
    forecast: Array<{ date: string; temperature: number; description: string }>;
  }>;
  GetCurrentWeather(data: {
    city: string;
  }): Promise<{ city: string; temperature: number; description: string }>;
}

@Injectable()
export class WeatherClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.WEATHER_GRPC_URL ?? 'weather-service:50051',
      package: 'weather',
      protoPath: join(__dirname, '../../../../proto/weather.proto'),
    },
  })
  private readonly client!: ClientGrpc;

  private service!: WeatherGrpc;

  onModuleInit() {
    this.service = this.client.getService<WeatherGrpc>('WeatherService');
  }

  getForecast(city: string) {
    return this.service.GetWeatherForecast({ city });
  }

  getCurrent(city: string) {
    return this.service.GetCurrentWeather({ city });
  }
}
