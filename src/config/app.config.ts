import 'dotenv/config';
import { AppConfig } from './types';

export const appConfig: AppConfig = {
   port: Number(process.env.PORT) || 3000,
   baseUrl: process.env.URL || '',
   environment: process.env.RUN_ENVIROMENT || 'development',
};
