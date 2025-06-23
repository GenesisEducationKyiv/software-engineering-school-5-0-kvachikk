import { Injectable } from '@nestjs/common';

import { ApiWeatherHandler } from '../providers/api-weather.handler';
import { OpenWeatherHandler } from '../providers/open-weather.handler';
import { Weather, WeatherHandler } from '../providers/weather.handler';

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
}
