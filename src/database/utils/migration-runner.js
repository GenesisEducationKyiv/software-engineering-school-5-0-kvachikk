const path = require('node:path');
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../sequelize');

const runMigrations = async () => {
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

module.exports = runMigrations;
