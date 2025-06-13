const INTERVALS = require('../constants/weather-config/intervals');
const FREQUENCIES = require('../constants/weather-config/frequencies');
const { sendForecasts } = require('./email-sender');

const FREQUENCY_HANDLERS = {
    HOURLY: async (subscriptionService) => {
        const subscriptions = await subscriptionService.getActiveSubscriptions(
            FREQUENCIES.HOURLY
        );
        await sendForecasts(subscriptions);
    },
    DAILY: async (subscriptionService) => {
        const subscriptions = await subscriptionService.getActiveSubscriptions(
            FREQUENCIES.DAILY
        );
        await sendForecasts(subscriptions);
    },
};

const createScheduler = (handler, interval, subscriptionService) => {
    const run = async () => {
        try {
            await handler(subscriptionService);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(run, interval);
        }
    };
    run();
};

const startScheduler = (subscriptionService) => {
    for (const handler of Object.keys(FREQUENCY_HANDLERS)) {
        createScheduler(
            FREQUENCY_HANDLERS[handler],
            INTERVALS[handler],
            subscriptionService
        );
        console.log(`Scheduled "${handler}" emails`);
    }
};

module.exports = startScheduler;
