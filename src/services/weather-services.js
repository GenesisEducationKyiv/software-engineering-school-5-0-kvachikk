const axios = require('axios');
const NotFoundError = require("../errors/not-found");

const getWeather = async (city) => {
    try {
        const response = await axios.get(`${process.env.OPEN_WEATHER_API_URL}/find`, {
            params: {q: city, appid: process.env.OPEN_WEATHER_API_KEY, units: 'metric'}
        });

        const data = response.data;

        if (!data.list || data.list.length === 0) {
            throw new NotFoundError(`City "${city}" not found`);
        }

        const {main, weather} = data.list[0];

        return {temperature: main.temp, humidity: main.humidity, description: weather[0].description};
    } catch (error) {
        if (error instanceof NotFoundError) throw error;

        if (error.response && error.response.status === 404) {
            throw new NotFoundError(`City "${city}" not found`);
        }
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
};

module.exports = {
    getWeather
};