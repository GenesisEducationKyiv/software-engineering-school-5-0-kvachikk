import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { weatherApiConfig } from '../config/weather-api.config';
import { WeatherApiResponse } from '../types/responses/weather-api-response';
import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class ApiWeatherProvider extends ChainableWeatherProvider {
   constructor(private readonly httpService: HttpService) {
      super();
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      const data = await this.fetchWeatherData(options.city);
      return this.formatWeatherData(data);
   }

   private async fetchWeatherData(city: string): Promise<WeatherApiResponse> {
      try {
         const params = {
            key: weatherApiConfig.apiKey,
            q: city,
            days: 4,
            aqi: 'no',
            alerts: 'no',
         } as const;

         const response = await firstValueFrom(
            this.httpService.get<WeatherApiResponse>(`${weatherApiConfig.apiUrl}/forecast.json`, { params }),
         );

         return response.data;
      } catch (error) {
         throw new Error(`WeatherAPI provider failed: ${error}`);
      }
   }

   private formatWeatherData(data: WeatherApiResponse): Weather[] {
      return data.forecast.forecastday.map((day) => ({
         temperature: day.day.maxtemp_c,
         humidity: day.day.avghumidity,
         description: day.day.condition.text,
      }));
   }
}
