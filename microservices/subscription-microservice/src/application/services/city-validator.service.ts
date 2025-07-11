import { Injectable } from '@nestjs/common';

import { WeatherDataProviderPort } from '../ports/weather-data-provider.port';

@Injectable()
export class CityValidatorService {
   constructor(private readonly weatherProvider: WeatherDataProviderPort) {}

   async validate(city: string): Promise<void> {
      await this.weatherProvider.validateCity(city);
   }
}
