const crypto = require("crypto");
const BadRequestError = require("../errors/invalid-request");
const sequelize = require("../database/sequelize");
const Frequency = require("../database/models/frequency")(sequelize, require("sequelize").DataTypes);
const Subscription = require("../database/models/subscription")(sequelize, require("sequelize").DataTypes);
const {getWeather} = require("./weather-services");
const {sendTemplateLetter} = require("../email-utils/sender");

const baseURL = process.env.URL;

const subscribe = async (email, city, frequency) => {
    try {
        // 1. Validate frequency
        const frequencyEntity = await Frequency.findOne({ where: { title: frequency } });
        if (!frequencyEntity) {
            const error = new Error(`Invalid frequency selected: ${frequency}`);
            error.status = 400;
            throw error;
        }

        // 2. Validate city
        try {
            await getWeather(city);
        } catch (weatherError) {
            if (weatherError.status) throw weatherError;
            throw new Error(`Weather check failed for city ${city}: ${weatherError.message}`);
        }

        // 3. Check if a subscription with this email already exists
        const existingSubscription = await Subscription.findOne({ where: { email } });

        if (existingSubscription) {
            const error = new Error(`Subscription for email ${email} already exists.`);
            error.status = 409;
            throw error;
        }

        // 4. If no existing subscription found for this email+city, create a new one
        const token = crypto.randomBytes(32).toString('hex');
        const newSubscription = await Subscription.create({
            email: email,
            city: city,
            frequencyId: frequencyEntity.id,
            verificationToken: token,
            isVerified: false,
            isActive: false
        });

        // 5. Send verification email for the NEW subscription
        await sendTemplateLetter({
            to: email,
            subject: `Welcome to weather updates for ${city}`,
            templatePath: "welcome.html",
            templateVars: {
                city,
                confirmUrl: `${baseURL}/api/confirm/${token}`,
                unsubscribeUrl: `${baseURL}/api/unsubscribe/${token}`
            }
        });

        return newSubscription;
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw new BadRequestError(`Subscription process failed: ${error.message}`);
    }
};

const confirmSubscription = async (token) => {
    try {
        const subscription = await Subscription.findOne({
            where: {verificationToken: token}
        });

        if (!subscription) {
            throw new Error('Invalid token');
        }

        await subscription.update({isActive: true, isVerified: true});

        await sendTemplateLetter({
            to: subscription.email,
            subject: `You have successfully confirmed your email!`,
            templatePath: "confirmed.html",
            templateVars: {
                city: subscription.city,
                unsubscribeUrl: `${baseURL}/api/unsubscribe/${token}`
            }
        });
    } catch (error) {
        throw new Error(`Confirmation failed: ${error.message}`);
    }
};

const unsubscribe = async (token) => {
    try {
        const subscription = await Subscription.findOne({
            where: {verificationToken: token}
        });

        if (!subscription) {
            throw new Error('Invalid or expired unsubscribe token');
        }

        await subscription.update({isActive: false});

        await sendTemplateLetter({
            to: subscription.email,
            subject: `You have successfully unsubscribed from ${subscription.city} weather forecast`,
            templatePath: "unsubscribed.html",
            templateVars: {
                city: subscription.city,
                subscribe: `${baseURL}/api/confirm/${token}`
            }
        });
    } catch (error) {
        throw new Error(`Unsubscribe failed: ${error.message}`);
    }
};

module.exports = {
    subscribe,
    confirmSubscription,
    unsubscribe
};