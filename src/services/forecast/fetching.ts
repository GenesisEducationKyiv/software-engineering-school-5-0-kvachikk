import { Injectable } from '@nestjs/common';
import { weatherConfig } from '../../config';
import { ICoordinates, IGeocodeResponseItem, IForecastItem, IForecastResponse } from '../../interfaces/Forecast';

@Injectable()
export class ForecastFetchingService {
   private async getCoordinatesByCityName(city: string): Promise<ICoordinates> {
      const geoUrl = `${weatherConfig.coordinatesUrl}${encodeURIComponent(city)}&limit=1&appid=${weatherConfig.apiKey}`;
      const response = await fetch(geoUrl);
      if (!response.ok) {
         throw new Error(`Failed to fetch coordinates: ${response.statusText}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: IGeocodeResponseItem[] = await response.json();

      if (!data || data.length === 0) {
         throw new Error(`No coordinates found for city: ${city}`);
      }

      const { lat, lon } = data[0];
      return { lat, lon };
   }

   private async fetchDataForecast(city: string): Promise<IForecastItem[]> {
      const { lat, lon } = await this.getCoordinatesByCityName(city);
      const forecastUrl = `${weatherConfig.baseUrl}/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${weatherConfig.apiKey}&units=metric`;

      const response = await fetch(forecastUrl);
      if (!response.ok) {
         throw new Error(`Failed to fetch forecast: ${response.statusText}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: IForecastResponse = await response.json();
      return data.list;
   }

   async fetchRawForecast(city: string): Promise<IForecastItem[] | null> {
      const rawList = await this.fetchDataForecast(city);

      if (!rawList || rawList.length === 0) {
         return null;
      }

      return rawList;
   }
}
