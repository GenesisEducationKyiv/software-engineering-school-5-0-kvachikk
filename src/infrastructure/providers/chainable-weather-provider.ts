import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';

import { Chainable } from './abstract-chain';
import { WeatherProvider } from './abstract-weather-provider';

export abstract class ChainableWeatherProvider
   extends Chainable<GetWeatherOptions, Weather[]>
   implements WeatherProvider
{
   abstract getWeather(options: GetWeatherOptions): Promise<Weather[]>;

   setNext(handler: ChainableWeatherProvider): ChainableWeatherProvider {
      this.nextHandler = handler;
      return handler;
   }

   async handle(options: GetWeatherOptions): Promise<Weather[]> {
      try {
         return await this.getWeather(options);
      } catch (error) {
         if (this.nextHandler && this.onError?.(error as Error)) {
            return this.nextHandler.handle(options);
         }

         throw error;
      }
   }
}
