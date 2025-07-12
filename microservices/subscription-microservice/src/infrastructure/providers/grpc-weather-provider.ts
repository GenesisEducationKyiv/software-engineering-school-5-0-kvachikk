import { join } from 'node:path';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';

import { WeatherDataProviderPort } from '../../application/ports/weather-data-provider.port';
import { NotFoundError } from '../../domain/errors/not-found.error';

interface WeatherGrpcService {
   GetCurrentWeather(data: { city: string }): Promise<{ city: string; temperature: number; description: string }>;
}

@Injectable()
export class GrpcWeatherProvider implements WeatherDataProviderPort, OnModuleInit {
   @Client({
      transport: Transport.GRPC,
      options: {
         url: process.env.WEATHER_GRPC_URL ?? 'localhost:50051',
         package: 'weather',
         protoPath: join(__dirname, '../../../../../../proto/weather.proto'),
      },
   })
   private readonly client!: ClientGrpc;

   private weatherService!: WeatherGrpcService;

   onModuleInit() {
      this.weatherService = this.client.getService<WeatherGrpcService>('WeatherService');
   }

   async validateCity(city: string): Promise<void> {
      try {
         await this.weatherService.GetCurrentWeather({ city });
      } catch (error: any) {
         // gRPC error handling
         if (error?.details?.includes('not found')) {
            throw new NotFoundError(`City: "${city}" not found`);
         }
         throw error;
      }
   }
}
