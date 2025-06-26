import { Weather } from '../types/weather';

export interface WeatherHandler {
   setNext(handler: WeatherHandler): WeatherHandler;

   handle(city: string): Promise<Weather[]>;
}

export class AbstractWeatherHandler implements WeatherHandler {
   private nextHandler: WeatherHandler;

   public setNext(handler: WeatherHandler): WeatherHandler {
      this.nextHandler = handler;
      return handler;
   }

   public async handle(city: string): Promise<Weather[]> {
      if (this.nextHandler) {
         return this.nextHandler.handle(city);
      } else {
         throw new Error(`All providers failed to process the request for city: ${city}`);
      }
   }
}
