const response = require('../utils/response-builder');
const messages = require('../constants/messages/subscription-response-messages');

const subscriptionController = (subscriptionService) => {
    const controller = {
        service: subscriptionService,

        async subscribe(req, res, next) {
            try {
                const { email, city, frequency } = req.body;
                await this.service.subscribe(email, city, frequency);
                response.created(res, messages.SUBSCRIBE_SUCCESS);
            } catch (error) {
                next(error);
            }
        },

        async confirm(req, res, next) {
            try {
                const { token } = req.params;
                await this.service.confirmSubscription(token);
                response.success(res, messages.CONFIRM_SUCCESS);
            } catch (error) {
                next(error);
            }
        },

        async unsubscribe(req, res, next) {
            try {
                const { token } = req.params;
                await this.service.unsubscribe(token);
                response.success(res, messages.UNSUBSCRIBE_SUCCESS);
            } catch (error) {
                next(error);
            }
        },
    };

    controller.subscribe = controller.subscribe.bind(controller);
    controller.confirm = controller.confirm.bind(controller);
    controller.unsubscribe = controller.unsubscribe.bind(controller);

    return controller;
};

module.exports = subscriptionController;
