import { Injectable } from '@nestjs/common';

import { ApiWeatherHandler } from './api-weather.handler';
import { OpenWeatherHandler } from './open-weather.handler';
import { WeatherHandler } from './weather.handler';

@Injectable()
export class WeatherHandlerChainFactory {
   constructor(
      private readonly openWeather: OpenWeatherHandler,
      private readonly apiWeather: ApiWeatherHandler,
   ) {}

   create(): WeatherHandler {
      this.openWeather.setNext(this.apiWeather);
      return this.openWeather;
   }
}
