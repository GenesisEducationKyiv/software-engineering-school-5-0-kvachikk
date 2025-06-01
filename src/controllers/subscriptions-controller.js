const services = require('../services/subscriptions-services');

const subscribe = async (req, res, next) => {
    try {
        const {email, city, frequency} = req.body;
        await services.subscribe(email, city, frequency);
        res.status(201).json('Subscription successful. Confirmation email sent.');
    } catch (error) {
        next(error);
    }
};

const confirmSubscription = async (req, res, next) => {
    try {
        await services.confirmSubscription(req.params.token);
        res.status(200).json('Subscription confirmed successfully!');
    } catch (error) {
        next(error);
    }
};

const unsubscribe = async (req, res, next) => {
    try {
        await services.unsubscribe(req.params.token);
        res.status(200).json('Successfully unsubscribed from weather updates!');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    subscribe,
    confirmSubscription,
    unsubscribe
};