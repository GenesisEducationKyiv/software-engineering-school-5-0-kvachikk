const crypto = require('crypto');
const NotFoundError = require('../constants/errors/not-found');

class SubscriptionService {
    constructor(subscriptionRepository, notificationService, weatherService) {
        this.repository = subscriptionRepository;
        this.notifier = notificationService;
        this.weatherService = weatherService;
    }

    _generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    async subscribe(email, city, frequency) {
        const frequencyEntity =
            await this.repository.findFrequencyByTitle(frequency);

        await this.weatherService.getWeatherByCity(city);

        await this.repository.findByEmail(email);

        const token = this._generateToken();
        const newSubscription = await this.repository.create({
            email,
            city,
            frequencyId: frequencyEntity.id,
            verificationToken: token,
            isVerified: false,
            isActive: false,
        });

        await this.notifier.sendWelcomeEmail(email, city, token);

        return newSubscription;
    }

    async confirmSubscription(token) {
        const subscription = await this.repository.findByToken(token);
        if (!subscription) {
            throw new NotFoundError(`Subscription: "${token}" not found`);
        }

        subscription.isActive = true;
        subscription.isVerified = true;
        await this.repository.save(subscription);

        await this.notifier.sendConfirmationEmail(
            subscription.email,
            subscription.city,
            token
        );

        return subscription;
    }

    async unsubscribe(token) {
        const subscription = await this.repository.findByToken(token);
        if (!subscription) {
            throw new NotFoundError(`Subscription: "${token}" not found`);
        }

        subscription.isActive = false;
        await this.repository.save(subscription);

        await this.notifier.sendUnsubscribeEmail(
            subscription.email,
            subscription.city,
            token
        );

        return subscription;
    }

    async getActiveSubscriptions(frequencyTitle) {
        if (!frequencyTitle) {
            throw new NotFoundError(frequencyTitle);
        }
        return this.repository.getActiveSubscriptionsByFrequency(
            frequencyTitle
        );
    }
}

module.exports = { SubscriptionService };
