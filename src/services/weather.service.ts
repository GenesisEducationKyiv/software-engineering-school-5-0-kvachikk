import { Injectable } from '@nestjs/common';

import { ApiWeatherHandler } from '../providers/api-weather.handler';
import { OpenWeatherHandler } from '../providers/open-weather.handler';
import { WeatherHandler } from '../providers/weather.handler';
import { Weather } from '../types/weather';

@Injectable()
export class WeatherService {
   private handler: WeatherHandler;

   constructor(openWeatherHandler: OpenWeatherHandler, apiWeatherHandler: ApiWeatherHandler) {
      openWeatherHandler.setNext(apiWeatherHandler);

      this.handler = openWeatherHandler;
   }

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      return this.handler.handle(city);
   }

   public async getCurrentWeather(city: string): Promise<Weather> {
      return (await this.handler.handle(city))[0];
   }
}
