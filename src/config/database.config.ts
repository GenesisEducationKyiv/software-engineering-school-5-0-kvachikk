import 'dotenv/config';
import { DatabaseConfig } from './types';

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
   test: configs.test,
   development: configs.development,
   production: configs.production,
   current: getCurrentConfig(),
};
