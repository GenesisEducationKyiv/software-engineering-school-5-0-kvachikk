import 'dotenv/config';
import { Provider } from '@nestjs/common';

import { ApplicationConfig } from '../../domain/types/configurations/application-config';
import { APPLICATION_CONFIG } from '../../shared/tokens/config-tokens';

export const applicationConfig: ApplicationConfig = {
   port: Number(process.env.PORT),
   baseUrl: process.env.URL || '',
   environment: process.env.RUN_ENVIROMENT || 'development',
};

export const ApplicationConfigProvider: Provider = {
   provide: APPLICATION_CONFIG,
   useValue: applicationConfig,
};
