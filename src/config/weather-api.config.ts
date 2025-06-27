import 'dotenv/config';
import { DataProviderConfig } from './types';

export const weatherApiConfig: DataProviderConfig = {
   apiUrl: process.env.WEATHERAPI_API_URL || '',
   apiKey: process.env.WEATHERAPI_API_KEY || '',
};
