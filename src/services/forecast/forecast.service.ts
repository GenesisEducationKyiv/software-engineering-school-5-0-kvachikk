import { Injectable } from '@nestjs/common';
import { ForecastFetchingService } from './fetching';
import { ForecastHandlingService } from './handling';
import { ITemplateWeatherItem } from '../../interfaces/Forecast';

@Injectable()
export class ForecastService {
   constructor(
      private readonly fetcher: ForecastFetchingService,
      private readonly handler: ForecastHandlingService,
   ) {}

   async getFormattedForecast(
      city: string,
   ): Promise<ITemplateWeatherItem[] | null> {
      const raw = await this.fetcher.fetchRawForecast(city);
      if (!raw) return null;
      const grouped = this.handler.groupForecastByDate(raw);
      return this.handler.mapForecastToTemplate(grouped);
   }
}
