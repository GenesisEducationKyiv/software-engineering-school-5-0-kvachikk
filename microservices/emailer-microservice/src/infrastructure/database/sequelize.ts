import { Sequelize } from 'sequelize-typescript';

import { databaseConfig } from '../config/database.config';

export const sequelize = new Sequelize(databaseConfig.current.url, {
   dialect: databaseConfig.current.dialect,
   logging: databaseConfig.current.logging,
   pool: databaseConfig.current.pool,
   dialectOptions: databaseConfig.current.dialectOptions,
});
