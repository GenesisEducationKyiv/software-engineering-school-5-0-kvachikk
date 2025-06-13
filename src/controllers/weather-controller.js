const response = require('../utils/response-builder');
const messages = require('../constants/messages/weather-response-messages');

const weatherController = (weatherService) => {
    const controller = {
        service: weatherService,

        async getWeather(req, res, next) {
            try {
                const weatherData = await this.service.getWeatherByCity(
                    req.query.city
                );
                response.success(
                    res,
                    messages.WEATHER_DATA_FETCHED,
                    weatherData
                );
            } catch (error) {
                next(error);
            }
        },
    };

    controller.getWeather = controller.getWeather.bind(controller);
    return controller;
};

module.exports = weatherController;
