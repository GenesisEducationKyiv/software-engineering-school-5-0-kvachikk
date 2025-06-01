const getWeatherCardClass = (iconCode) => {
    const code = iconCode.substring(0, 2);
    const dayOrNight = iconCode.substring(2);

    switch (code) {
        case '01':
            return dayOrNight === 'd' ? 'weather-card--clear-day' : 'weather-card--clear-night';
        case '02':
            return dayOrNight === 'd' ? 'weather-card--few-clouds-day' : 'weather-card--few-clouds-night';
        case '03':
            return 'weather-card--cloudy';
        case '04':
            return 'weather-card--overcast';
        case '09':
            return 'weather-card--shower-rain';
        case '10':
            return 'weather-card--rainy';
        case '11':
            return 'weather-card--thunderstorm';
        case '13':
            return 'weather-card--snowy';
        case '50':
            return 'weather-card--misty';
        default:
            return 'weather-card--default';
    }
};

module.exports = { getWeatherCardClass };