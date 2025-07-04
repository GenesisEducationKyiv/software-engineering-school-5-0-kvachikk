import { Injectable } from '@nestjs/common';

import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';
import { AppLogger } from '../logger/logger.service';

import { ChainableWeatherProvider } from './chainable-weather-provider';

@Injectable()
export class LoggingWeatherDecorator extends ChainableWeatherProvider {
   constructor(
      private readonly decorate: ChainableWeatherProvider,
      private readonly logger: AppLogger,
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
