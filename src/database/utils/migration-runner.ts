import * as path from 'node:path';
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '../sequelize';

export const runMigrations = async (): Promise<void> => {
   const umzug = new Umzug({
      migrations: {
         glob: path.resolve(__dirname, '../migrations/*.js'),
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
   });

   await umzug.up();
};
