const express = require('express');
const weatherRoutes = require('./weather-routes');
const subscriptionRoutes = require('./subscriptions-routes');

module.exports = (services) => {
    const router = express.Router();

    router.use('/weather', weatherRoutes(services.weatherService));
    router.use('/', subscriptionRoutes(services.subscriptionService));

    return router;
};
