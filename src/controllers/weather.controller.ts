import { Controller, Get, HttpCode, HttpStatus, Query, UsePipes } from '@nestjs/common';

import { Weather } from '../providers/weather.handler';
import { WeatherServices } from '../services/weather/weather.services';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

@Controller('weather')
export class WeatherController {
   constructor(private readonly weatherService: WeatherServices) {}

   @Get()
   @HttpCode(HttpStatus.OK)
   @UsePipes(new JoiValidationPipe(weatherParamsSchema))
   async getWeather(@Query() query: { city: string }): Promise<Weather> {
      return (await this.weatherService.getWeatherForecast(query.city))[0];
   }
}
