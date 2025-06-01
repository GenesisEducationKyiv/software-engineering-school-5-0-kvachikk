const express = require('express');
const router = express.Router();
const controller = require('../controllers/weather-controller');
const {validator} = require('../middlewares/validators');

router.get('/weather', validator.validateWeatherParams, controller.getWeather);

module.exports = router;