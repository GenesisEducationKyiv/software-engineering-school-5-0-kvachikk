import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { CurrentWeatherService } from '../services/weather/current';
import { weatherResponseMessages as messages } from '../constants/message/weather-responses';

@Controller('weather')
export class WeatherController {
   constructor(private readonly weatherService: CurrentWeatherService) {}

   @Get()
   @HttpCode(HttpStatus.OK)
   async getWeather(
      @Query('city') city: string,
   ): Promise<{ message: string; data: any }> {
      const data = await this.weatherService.getWeatherByCity(city);
      return { message: messages.WEATHER_DATA_FETCHED, data };
   }
}
