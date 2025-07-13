import { Injectable, Inject } from '@nestjs/common';

import { Weather } from '../../domain/types/weather';
import { WeatherResponseDto } from '../../presentation/dtos/weather-response.dto';
import { WeatherDataProvider } from '../ports/weather-data-provider.port';

@Injectable()
export class WeatherService {
   constructor(@Inject('WeatherHandler') private readonly provider: WeatherDataProvider) {}

   public async getWeatherForecast(city: string): Promise<WeatherResponseDto[]> {
      const weatherArr = await this.provider.handle({ city, date: new Date() });
      return weatherArr.map((weather) => this.mapToDto(weather));
   }

   public async getCurrentWeather(city: string): Promise<WeatherResponseDto> {
      return (await this.getWeatherForecast(city))[0];
   }

   private mapToDto(weather: Weather): WeatherResponseDto {
      return {
         temperature: weather.temperature,
         humidity: weather.humidity,
         description: weather.description,
      };
   }
}
