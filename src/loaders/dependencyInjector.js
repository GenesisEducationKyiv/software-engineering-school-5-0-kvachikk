const { Subscription, Frequency } = require('../database/models');
const { getWeatherByCity } = require('../services/weather-services');
const config = require('../config');

const {
    SubscriptionRepository,
} = require('../repository/subscription-repository');
const { NotificationService } = require('../services/notification-service');
const { SubscriptionService } = require('../services/subscriptions-services');

const dependencyInjectorLoader = () => {
    const subscriptionRepository = new SubscriptionRepository(
        Subscription,
        Frequency
    );
    const notificationService = new NotificationService({
        baseUrl: config.baseUrl,
    });
    const weatherService = { getWeatherByCity };

    const subscriptionService = new SubscriptionService(
        subscriptionRepository,
        notificationService,
        weatherService
    );

    console.log('Services injected');

    return {
        subscriptionService,
        weatherService,
    };
};

module.exports = dependencyInjectorLoader;
