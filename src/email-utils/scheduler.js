const {Subscription, Frequency} = require('../database/models');
const {fetchForecast} = require('./forecast-fetch');
const {sendTemplateLetter} = require('./sender');
const {getWeatherCardClass} = require("./get-weather-card");

const INTERVALS = {
    hourly: 60 * 60 * 1000,
    // hourly: 10 * 1000, // only for testing - sends emails each 10 seconds
    daily: 24 * 60 * 60 * 1000
};

const FREQUENCY_HANDLERS = {
    hourly: async () => {
        const subscriptions = await getActiveSubscriptions('hourly');
        await sendForecasts(subscriptions);
    },
    daily: async () => {
        const subscriptions = await getActiveSubscriptions('daily');
        await sendForecasts(subscriptions);
    }
};

const getActiveSubscriptions = async (frequency) => {
    return await Subscription.findAll({
        where: {isActive: true, isVerified: true},
        include: [{
            model: Frequency,
            as: 'Frequency',
            where: {title: frequency}
        }]
    });
};

const sendForecasts = async (subscriptions) => {
    for (const sub of subscriptions) {
        try {
            const rawList = await fetchForecast(sub.city);

            if (!rawList || rawList.length === 0) {
                console.error(`No forecast data returned for ${sub.city}`);
                continue;
            }
            const groupedByDate = {};

            rawList.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                if (!groupedByDate[date]) groupedByDate[date] = [];
                groupedByDate[date].push(item);
            });

            const formattedForecast = Object.keys(groupedByDate).slice(0, 5).map(date => {
                const dayData = groupedByDate[date];
                const noonData = dayData.find(item => item.dt_txt.includes('12:00:00')) || dayData[0];

                if (!noonData || !noonData.weather || noonData.weather.length === 0) {
                    return {
                        temp: {day: 'N/A'},
                        weather: [{description: 'No data', icon: '01d'}],
                        dt: new Date(date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                        }),
                        cardClass: getWeatherCardClass('01d')
                    };
                }

                const weatherIcon = noonData.weather[0].icon;
                const cardClass = getWeatherCardClass(weatherIcon);

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

            await sendTemplateLetter({
                to: sub.email,
                subject: `Weather forecast for ${sub.city}`,
                templatePath: 'weather-forecast.html',
                templateVars: {
                    city: sub.city,
                    forecast: formattedForecast,
                    unsubscribeUrl: `${process.env.URL}/api/unsubscribe/${sub.verificationToken}`,
                },
            });
        } catch (err) {
            console.error(`Error sending to ${sub.email}: ${err.message}`);
        }
    }
};

const startScheduler = async () => {
    for (const freq of Object.keys(FREQUENCY_HANDLERS)) {
        setInterval(() => FREQUENCY_HANDLERS[freq](), INTERVALS[freq]);
        console.log(`Scheduled "${freq}" emails\n`);
    }
};

module.exports = startScheduler;