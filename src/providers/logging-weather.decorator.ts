import { Injectable } from '@nestjs/common';

import { Logger } from '../logger/logger.service';
import { Weather } from '../types/weather';

import { WeatherHandler } from './weather.handler';

@Injectable()
export class LoggingWeatherHandlerDecorator implements WeatherHandler {
   constructor(
      private readonly decorate: WeatherHandler,
      private readonly logger: Logger,
      private readonly source: string,
   ) {}

   setNext(handler: WeatherHandler): WeatherHandler {
      return this.decorate.setNext(handler);
   }

   async handle(city: string): Promise<Weather[]> {
      try {
         const result = await this.decorate.handle(city);
         this.logger.response(`Fetched forecast from ${this.source}`, this.source, result);
         return result;
      } catch (error) {
         this.logger.error(`${this.source} error: ${error}`);
         throw error;
      }
   }
}
