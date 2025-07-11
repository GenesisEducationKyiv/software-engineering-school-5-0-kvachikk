import 'dotenv/config';
import { Provider } from '@nestjs/common';

import { DatabaseConfig } from '../../domain/types/configurations/database-config';
import { DATABASE_CONFIG } from '../../shared/tokens/config-tokens';

const createDatabaseConfig = (url: string): DatabaseConfig => ({
   url,
   dialect: 'postgres',
   logging: false,
   pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
   },
   dialectOptions: {
      ssl: {
         require: true,
         rejectUnauthorized: false,
      },
   },
});

const configs = {
   test: createDatabaseConfig(process.env.TEST_DB_URL || ''),
   development: createDatabaseConfig(process.env.DEVELOPMENT_DB_URL || ''),
   production: createDatabaseConfig(process.env.PRODUCTION_DB_URL || ''),
};

const getCurrentConfig = (): DatabaseConfig => {
   switch (process.env.RUN_ENVIROMENT) {
      case 'test':
         return configs.test;
      case 'production':
         return configs.production;
      case 'development':
      default:
         return configs.development;
   }
};

export const databaseConfig = {
   ...configs,
   current: getCurrentConfig(),
};

export const DatabaseConfigProvider: Provider = {
   provide: DATABASE_CONFIG,
   useValue: databaseConfig.current,
};
