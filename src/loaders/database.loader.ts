import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { databaseMessages as dbMessages } from '../constants/message/database';
import { testConnection } from '../database/utils/database-connect';
import { runMigrations } from '../database/utils/migration-runner';

@Injectable()
export class DatabaseLoader implements OnModuleInit {
   private readonly logger = new Logger(DatabaseLoader.name);

   async onModuleInit(): Promise<void> {
      await testConnection();
      this.logger.log(dbMessages.CONNECTED);

      await runMigrations();
      this.logger.log(dbMessages.MIGRATION_APPLIED);
   }
}
