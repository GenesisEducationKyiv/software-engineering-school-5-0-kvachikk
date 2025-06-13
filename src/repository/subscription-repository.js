class SubscriptionRepository {
    constructor(subscriptionModel, frequencyModel) {
        this.Subscription = subscriptionModel;
        this.Frequency = frequencyModel;
    }

    async findByEmail(email) {
        return this.Subscription.findOne({ where: { email } });
    }

    async findByToken(verificationToken) {
        return this.Subscription.findOne({ where: { verificationToken } });
    }

    async findFrequencyByTitle(title) {
        return this.Frequency.findOne({
            where: { title: title.toUpperCase() },
        });
    }

    async create(subscriptionData) {
        return this.Subscription.create(subscriptionData);
    }

    async save(subscriptionInstance) {
        return subscriptionInstance.save();
    }

    async getActiveSubscriptionsByFrequency(frequencyTitle) {
        return this.Subscription.findAll({
            where: { isActive: true, isVerified: true },
            include: [
                {
                    model: this.Frequency,
                    as: 'Frequency',
                    where: { title: frequencyTitle.toUpperCase() },
                },
            ],
        });
    }
}

module.exports = { SubscriptionRepository };
