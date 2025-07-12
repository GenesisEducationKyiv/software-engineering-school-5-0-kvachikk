import { join } from 'node:path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';

export type WeatherForecast = { temperature: number; humidity: number; description: string };

interface WeatherGrpcService {
   GetWeatherForecast(request: {
      city: string;
   }): Promise<{ forecast: Array<{ date: string; temperature: number; description: string }> }>;
}

@Injectable()
export class WeatherService implements OnModuleInit {
   @Client({
      transport: Transport.GRPC,
      options: {
         url: process.env.WEATHER_GRPC_URL ?? 'localhost:50051',
         package: 'weather',
         protoPath: join(__dirname, '../../../../../../proto/weather.proto'),
      },
   })
   private readonly client!: ClientGrpc;

   private weatherGrpcService!: WeatherGrpcService;

   onModuleInit() {
      this.weatherGrpcService = this.client.getService<WeatherGrpcService>('WeatherService');
   }

   async getWeatherForecast(city: string): Promise<WeatherForecast[]> {
      const { forecast } = await this.weatherGrpcService.GetWeatherForecast({ city });
      // Map gRPC response to internal DTO structure
      return forecast.map((entry) => ({
         temperature: entry.temperature,
         humidity: 0, // humidity not present in gRPC response; set 0 or adjust
         description: entry.description,
      }));
   }
}
