const { sendTemplateLetter } = require('../email-utils/email-sender');

class NotificationService {
    constructor(config) {
        this.config = config;
    }

    async sendWelcomeEmail(email, city, token) {
        const confirmUrl = `${this.config.baseUrl}/api/confirm/${token}`;
        const unsubscribeUrl = `${this.config.baseUrl}/api/unsubscribe/${token}`;
        return sendTemplateLetter({
            to: email,
            subject: `Welcome to weather updates for ${city}`,
            templatePath: 'welcome.html',
            templateVars: { city, confirmUrl, unsubscribeUrl },
        });
    }

    async sendConfirmationEmail(email, city, token) {
        const unsubscribeUrl = `${this.config.baseUrl}/api/unsubscribe/${token}`;
        return sendTemplateLetter({
            to: email,
            subject: 'You have successfully confirmed your email!',
            templatePath: 'confirmed.html',
            templateVars: { city, unsubscribeUrl },
        });
    }

    async sendUnsubscribeEmail(email, city, token) {
        const subscribeUrl = `${this.config.baseUrl}/api/confirm/${token}`;
        return sendTemplateLetter({
            to: email,
            subject: `You have successfully unsubscribed from ${city} weather forecast`,
            templatePath: 'unsubscribed.html',
            templateVars: { city, subscribe: subscribeUrl },
        });
    }
}

module.exports = { NotificationService };
