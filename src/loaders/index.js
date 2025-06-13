const expressLoader = require('./express');
const databaseLoader = require('./database');
const dependencyInjectorLoader = require('./dependencyInjector');
const schedulerLoader = require('./scheduler');

const init = async ({ expressApp }) => {
    await databaseLoader();
    const services = dependencyInjectorLoader();
    await expressLoader({ app: expressApp, services });
    await schedulerLoader(services);
};

module.exports = { init };
