import { Injectable } from '@nestjs/common';

import { weatherConfig } from '../../config';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { BadRequestError } from '../../constants/errors/bad-request.error';

export interface ICurrentWeather {
   temperature: number;
   humidity: number;
   description: string;
}

@Injectable()
export class CurrentWeatherService {
   async getWeatherByCity(city: string): Promise<ICurrentWeather> {
      try {
         const url = `${weatherConfig.baseUrl}/find?q=${encodeURIComponent(city)}&appid=${weatherConfig.apiKey}&units=metric`;

         const response = await fetch(url);

         if (!response.ok) {
            if (response.status === 400) {
               throw new BadRequestError(city);
            }
            if (response.status === 404) {
               throw new NotFoundError(city);
            }
            throw new Error(`Weather API error: ${response.statusText}`);
         }

         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         const data: any = await response.json();

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         if (!data.list || data.list.length === 0) {
            throw new NotFoundError(city);
         }

         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
         const { main, weather } = data.list[0];

         return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            temperature: main.temp,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            humidity: main.humidity,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            description: weather[0].description,
         };
      } catch (error: any) {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         if (!error.status) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
            throw new Error(error.message || String(error));
         }
         throw error;
      }
   }
}
