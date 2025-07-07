import { WeatherDataProvider } from '../../application/ports/weather-data-provider.port';
import { Weather } from '../../domain/types/weather';

export abstract class AbstractWeatherDataProvider implements WeatherDataProvider {
   abstract handle(params: { city: string; date: Date }): Promise<Weather[]>;
}

export abstract class Chainable<TRequest, TResponse> {
   protected nextHandler?: Chainable<TRequest, TResponse>;

   setNext(handler: Chainable<TRequest, TResponse>): Chainable<TRequest, TResponse> {
      this.nextHandler = handler;
      return handler;
   }

   abstract handle(params: TRequest): Promise<TResponse>;
}
