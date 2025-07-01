import { Injectable } from '@nestjs/common';

import { ApiWeatherProvider } from './api-weather-provider';
import { ChainableWeatherProvider } from './chainable-weather-provider';
import { OpenWeatherProvider } from './open-weather.provider';

@Injectable()
export class WeatherHandlerChainFactory {
   constructor(
      private readonly openWeather: OpenWeatherProvider,
      private readonly apiWeather: ApiWeatherProvider,
   ) {}

   create(): ChainableWeatherProvider {
      this.openWeather.setNext(this.apiWeather);
      return this.openWeather;
   }
}
