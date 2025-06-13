const { Sequelize } = require('sequelize');
const config = require('../config');

const dbConfig = config.database.current;

const sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
});

module.exports = sequelize;
