import 'dotenv/config';
import { DataProviderConfig } from './types';

export const openWeatherConfig: DataProviderConfig = {
   apiUrl: process.env.OPEN_WEATHER_API_URL || '',
   apiKey: process.env.OPEN_WEATHER_API_KEY || '',
};
