import { Controller, Get, HttpCode, HttpStatus, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Weather } from '../providers/weather.handler';
import { WeatherService } from '../services/weather.service';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
   constructor(private readonly weatherService: WeatherService) {}

   @Get()
   @ApiQuery({ name: 'city', type: String, description: 'City name', example: 'Kyiv' })
   @ApiOperation({ summary: 'Get current weather for a city' })
   @ApiResponse({ status: 200, description: 'Current weather data.' })
   @HttpCode(HttpStatus.OK)
   @UsePipes(new JoiValidationPipe(weatherParamsSchema))
   async getWeather(@Query() query: { city: string }): Promise<Weather> {
      return (await this.weatherService.getWeatherForecast(query.city))[0];
   }
}
