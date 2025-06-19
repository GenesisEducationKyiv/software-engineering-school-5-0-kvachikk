import 'dotenv/config';
import { AbstractWeatherHandler, Weather } from './weather.handler';
import { Coordinates } from '../interfaces/Coordinates';
import { NotFoundError } from '../constants/errors/not-found.error';

export type OpenWeatherApiResponse = {
   cod: string;
   message: number;
   cnt: number;
   list: Array<{
      dt: number;
      main: {
         temp: number;
         feels_like: number;
         temp_min: number;
         temp_max: number;
         pressure: number;
         sea_level: number;
         grnd_level: number;
         humidity: number;
         temp_kf: number;
      };
      weather: Array<{
         id: number;
         main: string;
         description: string;
         icon: string;
      }>;
   }>;
   city: {
      id: number;
      name: string;
      coord: {
         lat: number;
         lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
   };
};

export class OpenWeatherHandler extends AbstractWeatherHandler {
   public override async handle(city: string): Promise<Weather[]> {
      try {
         const coordinates = await this.getCoordinates(city);
         const forecastResponse = await fetch(
            `${process.env.OPEN_WEATHER_API_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=40&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`,
         );

         if (!forecastResponse.ok) {
            throw new Error(`OpenWeather provider failed: ${forecastResponse.status}`);
         }

         const forecastData = (await forecastResponse.json()) as OpenWeatherApiResponse;
         const dailyForecasts: Weather[] = [];

         for (let i = 3; i < forecastData.list.length; i += 8) {
            const entry = forecastData.list[i];
            dailyForecasts.push({
               temperature: entry.main.temp,
               humidity: entry.main.humidity,
               description: entry.weather[0].description,
            });
            if (dailyForecasts.length === 4) break;
         }

         console.log('FROM OPEN WEATHER MAP: ', dailyForecasts);
         return dailyForecasts;
      } catch (error) {
         console.error(`OpenWeatherHandler encountered an error: ${error}`);
         return super.handle(city);
      }
   }

   public async getCoordinates(city: string): Promise<Coordinates> {
      const geoUrl = `${process.env.OPEN_WEATHER_GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.OPEN_WEATHER_API_KEY}`;
      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
         throw new Error(`Failed to fetch coordinates for city: ${city}. Status: ${geoResponse.status}`);
      }

      const dataArray = (await geoResponse.json()) as any[];

      if (!dataArray || dataArray.length === 0) {
         throw new NotFoundError(`Unable to determine coordinates for city: ${city}`);
      }

      const coordinates = dataArray[0] as Coordinates;
      return {
         lat: coordinates.lat,
         lon: coordinates.lon,
      };
   }
}
