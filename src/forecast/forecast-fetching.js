const config = require('../config');

const getCoordinatesByCityName = async (city) => {
    const geoUrl = `${config.weatherApi.coordinatesUrl + encodeURIComponent(city)}&limit=1&appid=${config.weatherApi.apiKey}`;

    const response = await fetch(geoUrl);
    const data = await response.json();
    const { lat, lon } = data[0];
    return { lat, lon };
};

const fetchDataForecast = async (city) => {
    const { lat, lon } = await getCoordinatesByCityName(city);
    const forecastUrl = `${config.weatherApi.baseUrl}/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${config.weatherApi.apiKey}&units=metric`;

    const response = await fetch(forecastUrl);
    const data = await response.json();
    return data.list;
};

const fetchRawForecast = async (city) => {
    const rawList = await fetchDataForecast(city);

    if (!rawList || rawList.length === 0) {
        return null;
    }

    return rawList;
};

module.exports = {
    fetchRawForecast,
};
