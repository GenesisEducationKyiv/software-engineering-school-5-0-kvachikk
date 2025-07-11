import 'dotenv/config';
import { Provider } from '@nestjs/common';

import { DatabaseConfig } from '../../domain/types/configurations/database-config';
import { DATABASE_CONFIG } from '../../shared/tokens/config-tokens';

const createDatabaseConfig = (url: string, dialect: 'postgres' | 'sqlite'): DatabaseConfig => ({
   url,
   dialect,
   logging: false,
   pool: dialect === 'postgres' ? {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
   } : undefined,
   storage: dialect === 'sqlite' ? ':memory:' : undefined,
   dialectOptions: dialect === 'postgres' ? {
      ssl: {
         require: true,
         rejectUnauthorized: false,
      },
   } : undefined,
});

const configs = {
   test: createDatabaseConfig(process.env.TEST_DB_URL || 'sqlite::memory:', 'sqlite'),
   development: createDatabaseConfig(process.env.DEVELOPMENT_DB_URL || '', 'postgres'),
   production: createDatabaseConfig(process.env.PRODUCTION_DB_URL || '', 'postgres'),
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
