import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { WeatherDataProviderPort } from '../../application/ports/weather-data-provider.port';
import { NotFoundError } from '../../domain/errors/not-found.error';

@Injectable()
export class ApiWeatherProvider implements WeatherDataProviderPort {
   constructor(private readonly http: HttpService) {}

   async validateCity(city: string): Promise<void> {
      const url = process.env.WEATHER_SERVICE_URL;
      if (!url) throw new Error('WEATHER_SERVICE_URL not defined');

      try {
         await firstValueFrom(this.http.get(`${url}/weather`, { params: { city } }));
      } catch (error: any) {
         const status = (error.response?.status as number) ?? 500;
         if (status === 404) throw new NotFoundError(`City: "${city}" not found`);
         throw new HttpException('Weather service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }
   }
}
