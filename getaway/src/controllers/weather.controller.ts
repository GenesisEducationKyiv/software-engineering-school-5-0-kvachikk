import { Controller, Get, Query } from '@nestjs/common';

import { WeatherClient } from '../clients/weather.client';

@Controller('weather')
export class WeatherGatewayController {
  constructor(private readonly weatherClient: WeatherClient) {}

  @Get('current')
  async current(@Query('city') city: string) {
    return this.weatherClient.getCurrent(city);
  }

  @Get('forecast')
  async forecast(@Query('city') city: string) {
    return this.weatherClient.getForecast(city);
  }
} 