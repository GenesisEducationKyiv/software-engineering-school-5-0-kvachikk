const {Umzug, SequelizeStorage} = require("umzug");
const sequelize = require('../database/sequelize');
const Frequency = require("./models/frequency")(sequelize, require("sequelize").DataTypes);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully\n');
        return Promise.resolve();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return Promise.reject(error);
    }
};

const seedDatabase = async () => {
    try {
        const count = await Frequency.count();
        if (count > 0) {
            console.log('Seeding has been skipped because data already exists. \n');
            return;
        }

        await Frequency.bulkCreate([
            {title: 'hourly'},
            {title: 'daily'},
        ]);

    } catch (err) {
        console.error('Failed to seed database:', err);
    }
};

const runMigrations = async () => {
    const umzug = new Umzug({
        migrations: {
            glob: 'src/database/migrations/*.js',
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({sequelize}),
        logger: console,
    });

    await umzug.up();
    console.log('Migrations applied\n');
};

module.exports = {
    sequelize,
    testConnection,
    runMigrations,
    seedDatabase
};