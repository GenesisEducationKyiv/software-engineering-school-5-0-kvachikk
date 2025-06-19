import { Controller, Get, HttpCode, HttpStatus, Query, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

import { CurrentWeatherService } from '../services/weather/current';
import { weatherResponseMessages as messages } from '../constants/message/weather-responses';

@Controller('weather')
export class WeatherController {
   constructor(private readonly weatherService: CurrentWeatherService) {}

   @Get()
   @HttpCode(HttpStatus.OK)
   @UsePipes(new JoiValidationPipe(weatherParamsSchema))
   async getWeather(@Query() query: { city: string }): Promise<{ message: string; data: any }> {
      const { city } = query;
      const data = await this.weatherService.getWeatherByCity(city);
      return { message: messages.WEATHER_DATA_FETCHED, data };
   }
}
