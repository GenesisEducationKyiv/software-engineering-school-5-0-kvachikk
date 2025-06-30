import 'dotenv/config';
import { DataProviderConfig } from '../types/configurations/data-provider-config';

export const weatherApiConfig: DataProviderConfig = {
   apiUrl: process.env.WEATHERAPI_API_URL || '',
   apiKey: process.env.WEATHERAPI_API_KEY || '',
};
