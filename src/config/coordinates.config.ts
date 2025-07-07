import 'dotenv/config';
import { DataProviderConfig } from '../types/configurations/data-provider-config';

export const coordinatesConfig: DataProviderConfig = {
   apiUrl: process.env.OPEN_WEATHER_GEO_URL || '',
   apiKey: process.env.OPEN_WEATHER_GEO_KEY || '',
};
