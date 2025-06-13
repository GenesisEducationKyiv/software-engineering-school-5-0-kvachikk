const express = require('express');
const weatherController = require('../controllers/weather-controller');
const validate = require('../middlewares/validation.js');
const { weatherParamsSchema } = require('../middlewares/validation/schemas');

module.exports = (weatherService) => {
    const router = express.Router();
    const controller = weatherController(weatherService);
    const validateWeatherQuery = validate(weatherParamsSchema, 'query');

    router.get('/', validateWeatherQuery, controller.getWeather);

    return router;
};
