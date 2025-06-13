const axios = require('axios');
const config = require('../config/index');
const NotFoundError = require('../constants/errors/not-found');
const BadRequestError = require('../constants/errors/not-found');

const getWeatherByCity = async (city) => {
    try {
        const response = await axios.get(`${config.weatherApi.baseUrl}/find`, {
            params: {
                q: city,
                appid: config.weatherApi.apiKey,
                units: 'metric',
            },
        });

        const data = response.data;

        if (!data.list || data.list.length === 0) {
            throw new NotFoundError(city);
        }

        const { main, weather } = data.list[0];

        return {
            temperature: main.temp,
            humidity: main.humidity,
            description: weather[0].description,
        };
    } catch (error) {
        if (!error.status) {
            if (error.response?.status === 400) {
                throw new BadRequestError(error);
            } else if (error.response?.status === 404) {
                throw new NotFoundError(error);
            } else {
                throw new Error(error);
            }
        }
        throw error;
    }
};

module.exports = {
    getWeatherByCity,
};
