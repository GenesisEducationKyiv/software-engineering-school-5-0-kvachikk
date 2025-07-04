import 'dotenv/config';
import { ApplicationConfig } from '../../domain/types/configurations/application-config';

export const applicationConfig: ApplicationConfig = {
   port: Number(process.env.PORT),
   baseUrl: process.env.URL || '',
   environment: process.env.RUN_ENVIROMENT || 'development',
};
