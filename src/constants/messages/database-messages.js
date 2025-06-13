const databaseMessages = Object.freeze({
    CONNECTED: 'Database connected',
    ERROR: 'Unable to connect to the database',
    SEEDING_SKIPPED: 'Seeding has been skipped',
    SEEDING_SUCCESS: 'Seeding completed',
    SEEDING_ERROR: 'Failed to seed database',
    MIGRATION_APPLIED: 'Migrations applied',
});

module.exports = databaseMessages;
