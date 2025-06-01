const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const COORDINATES_API_URL = process.env.COORDINATES_API_URL;
const OPEN_WEATHER_API_URL = process.env.OPEN_WEATHER_API_URL;

const getCoordinatesByCityName = async (city) => {
    const geoUrl = `${COORDINATES_API_URL + encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (data.length === 0) {
            throw new Error('City not found');
        }

        const {lat, lon} = data[0];
        return {lat, lon};
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
    }
};

const fetchForecast = async (city) => {
    try {
        const { lat, lon } = await getCoordinatesByCityName(city);
        const forecastUrl = `${OPEN_WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}&units=metric`;

        const response = await fetch(forecastUrl);
        const data = await response.json();

        if (data.cod !== "200") {
            throw new Error(`Forecast API error: ${data.message}`);
        }
        return data.list;
    } catch (error) {
        console.error('Error fetching daily forecast:', error.message);
    }
};

module.exports = {
    fetchForecast
};