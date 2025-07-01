import 'dotenv/config';
import { Injectable } from '@nestjs/common';

import { coordinatesConfig } from '../config/coordinates.config';
import { openWeatherConfig } from '../config/open-weather.config';
import { NotFoundError } from '../constants/errors/not-found.error';
import { Coordinates } from '../types/coordinates';
import { OpenWeatherApiResponse } from '../types/responses/open-weather-api-response';
import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class OpenWeatherProvider extends ChainableWeatherProvider {
   constructor() {
      super();
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      const coordinates = await this.getCoordinates(options.city);
      const data = await this.fetchWeatherData(this.buildApiUrl(coordinates));
      return this.formatWeatherData(data);
   }

   public async getCoordinates(city: string): Promise<Coordinates> {
      const geoResponse = await fetch(
         `${coordinatesConfig.apiUrl}?q=${encodeURIComponent(city)}&limit=1&appid=${coordinatesConfig.apiKey}`,
      );

      if (!geoResponse.ok) {
         this.handleAndThrowError(`Failed to fetch coordinates for city: ${city}. Status: ${geoResponse.status}`);
      }

      const dataArray = (await geoResponse.json()) as unknown[];

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
   }

   private handleAndThrowError(message: string, error?: Error): never {
      if (error) {
         throw error;
      }
      throw new Error(message);
   }

   private buildApiUrl(coordinates: Coordinates): string {
      return `${openWeatherConfig.apiUrl}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=40&appid=${openWeatherConfig.apiKey}&units=metric`;
   }

   private async fetchWeatherData(url: string): Promise<OpenWeatherApiResponse> {
      const response = await fetch(url);

      if (!response.ok) {
         this.handleAndThrowError(`OpenWeather provider failed: ${response.status}`);
      }

      return (await response.json()) as OpenWeatherApiResponse;
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
