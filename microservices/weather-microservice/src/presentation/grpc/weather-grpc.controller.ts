import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { WeatherService } from '../../application/services/weather.service';

interface WeatherRequest {
   city: string;
}

@Controller()
export class WeatherGrpcController {
   constructor(private readonly weatherService: WeatherService) {}

   @GrpcMethod('WeatherService', 'GetWeatherForecast')
   public async getWeatherForecast(request: WeatherRequest) {
      const result = await this.weatherService.getWeatherForecast(request.city);
      return {
         forecast: result.map((day, idx) => ({
            date: new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: day.temperature,
            description: day.description,
         })),
      };
   }

   @GrpcMethod('WeatherService', 'GetCurrentWeather')
   public async getCurrentWeather(request: WeatherRequest) {
      const weather = await this.weatherService.getCurrentWeather(request.city);
      return {
         city: request.city,
         temperature: weather.temperature,
         description: weather.description,
      };
   }
} 