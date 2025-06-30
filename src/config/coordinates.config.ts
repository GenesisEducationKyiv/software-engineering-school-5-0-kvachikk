import 'dotenv/config';
import { DataProviderConfig } from './types';

export const coordinatesConfig: DataProviderConfig = {
   apiUrl: process.env.OPEN_WEATHER_GEO_URL || '',
   apiKey: process.env.OPEN_WEATHER_GEO_KEY || '',
};
