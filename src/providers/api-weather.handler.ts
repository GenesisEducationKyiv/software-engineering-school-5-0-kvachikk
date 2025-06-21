import 'dotenv/config';
import { AbstractWeatherHandler, Weather } from './weather.handler';
import { Logger } from '../logger/logger.service';
import { Injectable } from '@nestjs/common';

export type WeatherApiResponse = {
   location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime_epoch: number;
      localtime: string;
   };
   current: {
      temp_c: number;
      condition: {
         text: string;
      };
      humidity: number;
   };
   forecast: {
      forecastday: {
         date: string;
         date_epoch: number;
         day: {
            maxtemp_c: number;
            avghumidity: number;
            condition: {
               text: string;
            };
         };
      }[];
   };
};

@Injectable()
export class ApiWeatherHandler extends AbstractWeatherHandler {
   constructor(private readonly logger: Logger) {
      super();
   }

   public async handle(city: string): Promise<Weather[]> {
      try {
         const response = await fetch(
            `${process.env.WEATHERAPI_API_URL}/forecast.json?key=${process.env.WEATHERAPI_API_KEY}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`,
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
