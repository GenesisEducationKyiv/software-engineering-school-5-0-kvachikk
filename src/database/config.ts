import { databaseConfig } from '../config';

export default {
   test: {
      ...databaseConfig.test,
   },

   development: {
      ...databaseConfig.development,
   },

   production: {
      ...databaseConfig.production,
   },
};
