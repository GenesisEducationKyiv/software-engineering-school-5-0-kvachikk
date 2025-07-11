import 'dotenv/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { NotFoundError } from '../../domain/errors/not-found.error';
import { Coordinates } from '../../domain/types/coordinates';
import { OpenWeatherApiResponse } from '../../domain/types/responses/open-weather-api-response';
import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';
import { coordinatesConfig } from '../config/coordinates.config';
import { openWeatherConfig } from '../config/open-weather.config';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class OpenWeatherProvider extends ChainableWeatherProvider {
   constructor(private readonly httpService: HttpService) {
      super();
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      const coordinates = await this.getCoordinates(options.city);
      const data = await this.fetchWeatherData(coordinates);
      return this.formatWeatherData(data);
   }

   public async getCoordinates(city: string): Promise<Coordinates> {
      try {
         const params = {
            q: city,
            limit: 1,
            appid: coordinatesConfig.apiKey,
         } as const;

         const response = await firstValueFrom(this.httpService.get<unknown[]>(coordinatesConfig.apiUrl, { params }));

         const dataArray = response.data;

         if (!dataArray || dataArray.length === 0) {
            this.handleAndThrowError(
               `Unable to determine coordinates for city: ${city}`,
               new NotFoundError(`Unable to determine coordinates for city: ${city}`),
            );
         }

         const coordinates = dataArray[0] as Coordinates;
         return {
            lat: coordinates.lat,
            lon: coordinates.lon,
         };
      } catch (error) {
         this.handleAndThrowError(`Failed to fetch coordinates for city: ${city}`, error as Error);
      }
   }

   private handleAndThrowError(message: string, error?: Error): never {
      if (error) {
         throw error;
      }
      throw new Error(message);
   }

   private async fetchWeatherData(coordinates: Coordinates): Promise<OpenWeatherApiResponse> {
      try {
         const params = {
            lat: coordinates.lat,
            lon: coordinates.lon,
            cnt: 40,
            appid: openWeatherConfig.apiKey,
            units: 'metric',
         } as const;

         const response = await firstValueFrom(
            this.httpService.get<OpenWeatherApiResponse>(`${openWeatherConfig.apiUrl}/forecast`, { params }),
         );

         return response.data;
      } catch (error) {
         this.handleAndThrowError(`OpenWeather provider failed`, error as Error);
      }
   }

   private formatWeatherData(data: OpenWeatherApiResponse): Weather[] {
      const forecast: Weather[] = [];

      // The OpenWeather 3-hourly forecast returns 40 entries (5 days * 8).
      // We pick midday (index 3) for each following day.
      for (let i = 3; i < data.list.length; i += 8) {
         const entry = data.list[i];
         forecast.push({
            temperature: entry.main.temp,
            humidity: entry.main.humidity,
            description: entry.weather[0].description,
         });

         if (forecast.length === 4) break;
      }

      return forecast;
   }
}
