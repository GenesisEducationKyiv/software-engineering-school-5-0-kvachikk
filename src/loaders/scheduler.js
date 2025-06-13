const startScheduler = require('../email-utils/emails-scheduler');

module.exports = ({ subscriptionService }) => {
    startScheduler(subscriptionService);
};
