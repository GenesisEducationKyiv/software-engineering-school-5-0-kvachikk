const sequelize = require('../sequelize');

const testConnection = async () => {
    await sequelize.authenticate();
    return Promise.resolve();
};

module.exports = testConnection;
