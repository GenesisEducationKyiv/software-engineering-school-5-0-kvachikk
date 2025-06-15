import 'dotenv/config';
import { WeatherConfig } from './types';

export const weatherConfig: WeatherConfig = {
   baseUrl: process.env.OPEN_WEATHER_API_URL || '',
   coordinatesUrl: process.env.COORDINATES_API_URL || '',
   apiKey: process.env.OPEN_WEATHER_API_KEY || '',
};
