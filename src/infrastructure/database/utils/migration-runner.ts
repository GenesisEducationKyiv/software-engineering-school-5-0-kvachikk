import * as path from 'node:path';

import { Umzug, SequelizeStorage } from 'umzug';

import { sequelize } from '../sequelize';

export const runMigrations = async (): Promise<void> => {
   const migrationsGlob = path.resolve(__dirname, '../migrations/*.{js,ts}');

   const umzug = new Umzug({
      migrations: {
         glob: migrationsGlob,
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
   });

   await umzug.up();
};
