import { Injectable } from '@nestjs/common';

import { weatherApiConfig } from '../config/weather-api.config';
import { WeatherApiResponse } from '../types/responses/weather-api-response';
import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class ApiWeatherProvider extends ChainableWeatherProvider {
   constructor() {
      super();
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      const url = this.buildApiUrl(options.city);
      const data = await this.fetchWeatherData(url);
      return this.formatWeatherData(data);
   }

   private buildApiUrl(city: string): string {
      return `${weatherApiConfig.apiUrl}/forecast.json?key=${weatherApiConfig.apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`;
   }

   private async fetchWeatherData(url: string): Promise<WeatherApiResponse> {
      const response = await fetch(url);

      if (!response.ok) {
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
