import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

export interface WeatherDataProvider {
   setNext(handler: WeatherDataProvider): WeatherDataProvider;

   handle(options: GetWeatherOptions): Promise<Weather[]>;
}

export abstract class Chainable<Request, Response> {
   protected nextHandler?: Chainable<Request, Response>;
   protected onError?: (error: Error) => boolean;

   setNext(handler: Chainable<Request, Response>): Chainable<Request, Response> {
      this.nextHandler = handler;
      return handler;
   }

   abstract handle(request: Request): Promise<Response>;
}
