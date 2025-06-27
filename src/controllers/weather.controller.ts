import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WeatherService } from '../services/weather.service';
import { Weather } from '../types/weather';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

const weatherQueryDecorator = ApiQuery({
   name: 'city',
   type: String,
   description: 'City name',
   example: 'Kyiv',
});

@ApiTags('Weather')
@Controller('weather')
@UseInterceptors(CacheInterceptor)
@UsePipes(new JoiValidationPipe(weatherParamsSchema))
export class WeatherController {
   constructor(private readonly weatherService: WeatherService) {}

   @Get('current')
   @weatherQueryDecorator
   @ApiOperation({ summary: 'Get current weather for a city' })
   @ApiResponse({ status: 200, description: 'Current weather data' })
   async getCurrentWeather(@Query() { city }: { city: string }): Promise<Weather> {
      return this.weatherService.getCurrentWeather(city);
   }

   @Get('forecast')
   @weatherQueryDecorator
   @ApiOperation({ summary: 'Get weather forecast for a city' })
   @ApiResponse({ status: 200, description: 'Weather forecast data' })
   async getWeatherForecast(@Query() { city }: { city: string }): Promise<Weather[]> {
      return this.weatherService.getWeatherForecast(city);
   }
}
