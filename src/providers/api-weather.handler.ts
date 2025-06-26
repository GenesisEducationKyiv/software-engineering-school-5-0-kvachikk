import 'dotenv/config';
import { Injectable } from '@nestjs/common';

import { weatherApiConfig } from '../config/weather-api.config';
import { Logger } from '../logger/logger.service';
import { Weather } from '../types/weather';
import { WeatherApiResponse } from '../types/weather-api-response';

import { AbstractWeatherHandler } from './weather.handler';

@Injectable()
export class ApiWeatherHandler extends AbstractWeatherHandler {
   constructor(private readonly logger: Logger) {
      super();
   }

   public async handle(city: string): Promise<Weather[]> {
      try {
         const response = await fetch(
            `${weatherApiConfig.apiUrl}/forecast.json?key=${weatherApiConfig.apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`,
         );

         if (!response.ok) {
            this.logger.error(`WeatherAPI provider failed: ${response.status}`);
            throw new Error(`WeatherAPI provider failed: ${response.status}`);
         }

         const data = (await response.json()) as WeatherApiResponse;

         const currentWeather: Weather = {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
         };

         const forecastWeathers: Weather[] = data.forecast.forecastday.map((day) => ({
            temperature: day.day.maxtemp_c,
            humidity: day.day.avghumidity,
            description: day.day.condition.text,
         }));

         const formattedResponse = [currentWeather, ...forecastWeathers.slice(1, 4)];
         this.logger.response('Fetched forecast from WeatherAPI', 'WeatherAPI', formattedResponse);

         return formattedResponse;
      } catch (error) {
         this.logger.error(`ApiWeatherHandler error: ${error}`);
         return super.handle(city);
      }
   }
}
