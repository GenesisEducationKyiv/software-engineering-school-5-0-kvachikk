import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { WeatherApiResponse } from '../../domain/types/responses/weather-api-response';
import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';
import { weatherApiConfig } from '../config/weather-api.config';

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
      const forecastDays = data.forecast?.forecastday ?? [];
      const result: Weather[] = [];

      for (const day of forecastDays) {
         const daily = day.day;

         if (daily && typeof daily.maxtemp_c === 'number' && daily.condition?.text) {
            result.push({
               temperature: daily.maxtemp_c,
               humidity: daily.avghumidity ?? data.current?.humidity ?? 0,
               description: daily.condition.text,
            });
            continue;
         }

         const hours = day.hour ?? [];
         const fallbackHour = hours[12] ?? hours[Math.floor(hours.length / 2)] ?? hours[0];

         if (fallbackHour && typeof fallbackHour.temp_c === 'number' && fallbackHour.condition?.text) {
            result.push({
               temperature: fallbackHour.temp_c,
               humidity: fallbackHour.humidity ?? data.current?.humidity ?? 0,
               description: fallbackHour.condition.text,
            });
         }
      }

      if (result.length) {
         return result;
      }

      if (data.current?.condition?.text) {
         return [
            {
               temperature: data.current.temp_c,
               humidity: data.current.humidity,
               description: data.current.condition.text,
            },
         ];
      }

      throw new Error('No valid weather data in WeatherAPI response');
   }
}
