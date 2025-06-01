const services = require('../services/weather-services');

const getWeather = async (req, res, next) => {
    try {
        const weatherData = await services.getWeather(req.query.city);
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWeather
};