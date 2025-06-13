const testConnection = require('../database/utils/database-connection');
const runMigrations = require('../database/utils/migration-runner');
const seedFrequencies = require('../database/utils/database-seeders');
const dbMessages = require('../constants/messages/database-messages');

const databaseLoader = async () => {
    await testConnection();
    console.log(dbMessages.CONNECTED);

    await runMigrations();
    console.log(dbMessages.MIGRATION_APPLIED);

    await seedFrequencies();
    console.log(dbMessages.SEEDING_SUCCESS);
};

module.exports = databaseLoader;
