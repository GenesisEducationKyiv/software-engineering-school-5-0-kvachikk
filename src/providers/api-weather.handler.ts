import 'dotenv/config';
import { Injectable } from '@nestjs/common';

import { weatherApiConfig } from '../config/weather-api.config';
import { Logger } from '../logger/logger.service';
import { WeatherApiResponse } from '../types/responses/weather-api-response';
import { Weather } from '../types/weather';

import { AbstractWeatherHandler } from './weather.handler';

@Injectable()
export class ApiWeatherHandler extends AbstractWeatherHandler {
   constructor(private readonly logger: Logger) {
      super();
   }

   public async handle(city: string): Promise<Weather[]> {
      try {
         const url = this.buildApiUrl(city);
         const data = await this.fetchWeatherData(url);
         const formattedResponse = this.formatWeatherData(data);

         this.logger.response('Fetched forecast from WeatherAPI', 'WeatherAPI', formattedResponse);
         return formattedResponse;
      } catch (error) {
         this.logger.error(`ApiWeatherHandler error: ${error}`);
         return super.handle(city);
      }
   }

   private buildApiUrl(city: string): string {
      return `${weatherApiConfig.apiUrl}/forecast.json?key=${weatherApiConfig.apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`;
   }

   private async fetchWeatherData(url: string): Promise<WeatherApiResponse> {
      const response = await fetch(url);

      if (!response.ok) {
         this.logger.error(`WeatherAPI provider failed: ${response.status}`);
         throw new Error(`WeatherAPI provider failed: ${response.status}`);
      }

      return (await response.json()) as WeatherApiResponse;
   }

   private formatWeatherData(data: WeatherApiResponse): Weather[] {
      return data.forecast.forecastday.map((day) => ({
         temperature: day.day.maxtemp_c,
         humidity: day.day.avghumidity,
         description: day.day.condition.text,
      }));
   }
}
