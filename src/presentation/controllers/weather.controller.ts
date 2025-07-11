import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WeatherService } from '../../application/services/weather.service';
import { Weather } from '../../domain/types/weather';
import { WeatherQueryDto } from '../dtos/weather-query.dto';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

@ApiTags('Weather')
@Controller('weather')
@UsePipes(new JoiValidationPipe(weatherParamsSchema))
export class WeatherController {
   constructor(private readonly weatherService: WeatherService) {}

   @Get('current')
   @ApiOperation({ summary: 'Get current weather for a city' })
   @ApiResponse({ status: 200, description: 'Current weather data' })
   async getCurrentWeather(@Query() query: WeatherQueryDto): Promise<Weather> {
      return this.weatherService.getCurrentWeather(query.city);
   }

   @Get('forecast')
   @ApiOperation({ summary: 'Get weather forecast for a city' })
   @ApiResponse({ status: 200, description: 'Weather forecast data' })
   async getWeatherForecast(@Query() query: WeatherQueryDto): Promise<Weather[]> {
      return this.weatherService.getWeatherForecast(query.city);
   }
}
