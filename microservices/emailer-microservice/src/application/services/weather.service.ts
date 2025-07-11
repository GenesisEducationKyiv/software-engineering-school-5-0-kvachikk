import { Injectable } from '@nestjs/common';

export type WeatherForecast = { temperature: number; humidity: number; description: string };

@Injectable()
export class WeatherService {
   async getWeatherForecast(_city: string): Promise<WeatherForecast[]> {
      return [
         { temperature: 20, humidity: 60, description: 'Clear sky' },
         { temperature: 22, humidity: 55, description: 'Few clouds' },
      ];
   }
}
