const weatherCardMap = require('../constants/weather-config/weather-card-map');

const getWeatherCardClass = (iconCode) => {
    if (typeof iconCode !== 'string' || iconCode.length < 3) {
        return 'weather-card--default';
    }

    const code = iconCode.substring(0, 2);
    const dayOrNight = iconCode.substring(2);
    const baseClass = weatherCardMap[code];

    if (baseClass) {
        if (typeof baseClass === 'object' && baseClass[dayOrNight]) {
            return baseClass[dayOrNight];
        }
        if (typeof baseClass === 'string') {
            return baseClass;
        }
    }

    return 'weather-card--default';
};

const groupForecastByDate = (rawList) => {
    const groupedByDate = {};
    rawList.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(item);
    });
    return groupedByDate;
};

const mapForecastToTemplate = (groupedForecasts) => {
    return Object.keys(groupedForecasts)
        .slice(0, 5)
        .map((date) => {
            const dayData = groupedForecasts[date];
            const noonData =
                dayData.find((item) => item.dt_txt.includes('12:00:00')) ||
                dayData[0];

            if (
                !noonData ||
                !noonData.weather ||
                noonData.weather.length === 0
            ) {
                return {
                    temp: { day: 'N/A' },
                    weather: [{ description: 'No data', icon: '01d' }],
                    dt: new Date(date).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                    }),
                    cardClass: getWeatherCardClass('01d', 'd'),
                };
            }

            const weatherIcon = noonData.weather[0].icon;

            const cardClass = getWeatherCardClass(
                weatherIcon,
                weatherIcon.slice(-1)
            );

            return {
                temp: {
                    day: Math.round(noonData.main.temp),
                },
                weather: [
                    {
                        description: noonData.weather[0].description,
                        icon: weatherIcon,
                    },
                ],
                dt: new Date(noonData.dt * 1000).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                }),
                cardClass: cardClass,
            };
        });
};

module.exports = {
    getWeatherCardClass,
    groupForecastByDate,
    mapForecastToTemplate,
};
