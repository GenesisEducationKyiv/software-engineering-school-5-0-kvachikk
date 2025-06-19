import { Injectable } from '@nestjs/common';
import { Weather, WeatherHandler } from '../../providers/weather.handler';
import { OpenWeatherHandler } from '../../providers/open-weather.handler';
import { ApiWeatherHandler } from '../../providers/api-weather.handler';

@Injectable()
export class WeatherServices {
   private handler: WeatherHandler;

   constructor() {
      const openWeatherHandler = new OpenWeatherHandler();
      const apiWeatherHandler = new ApiWeatherHandler();

      openWeatherHandler.setNext(apiWeatherHandler);

      this.handler = openWeatherHandler;
   }

   public async getWeatherForecast(city: string): Promise<Weather[]> {
      return this.handler.handle(city);
   }
}
