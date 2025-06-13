const express = require('express');
const subscriptionController = require('../controllers/subscriptions-controller');
const validate = require('../middlewares/validation.js');
const {
    subscriptionSchema,
    verifyEmailSchema,
} = require('../middlewares/validation/schemas');

module.exports = (subscriptionService) => {
    const router = express.Router();
    const controller = subscriptionController(subscriptionService);
    const validateSubscriptionBody = validate(subscriptionSchema, 'body');
    const validateTokenParams = validate(verifyEmailSchema, 'params');

    router.post('/subscribe', validateSubscriptionBody, controller.subscribe);
    router.get('/confirm/:token', validateTokenParams, controller.confirm);
    router.get(
        '/unsubscribe/:token',
        validateTokenParams,
        controller.unsubscribe
    );

    return router;
};
