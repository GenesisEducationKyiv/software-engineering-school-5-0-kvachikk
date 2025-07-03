import { Injectable } from '@nestjs/common';

import { Logger } from '../logger/logger.service';
import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class LoggingWeatherDecorator extends ChainableWeatherProvider {
   constructor(
      private readonly decorate: ChainableWeatherProvider,
      private readonly logger: Logger,
      private readonly source: string,
   ) {
      super();
   }

   setNext(handler: ChainableWeatherProvider): ChainableWeatherProvider {
      return this.decorate.setNext(handler);
   }

   async getWeather(options: GetWeatherOptions): Promise<Weather[]> {
      try {
         const result = await this.decorate.handle(options);
         this.logger.response(`Fetched forecast from ${this.source}`, this.source, result);
         return result;
      } catch (error) {
         this.logger.error(`${this.source} error: ${error}`);
         throw error;
      }
   }
}
