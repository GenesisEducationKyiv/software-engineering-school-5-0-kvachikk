const Joi = require('joi');
const messages = require('../../constants/messages/validation-messages');

const schemas = {
    subscriptionSchema: Joi.object({
        email: Joi.string().email().required().trim().messages({
            'string.email': messages.EMAIL_INVALID,
            'any.required': messages.EMAIL_REQUIRED,
            'string.empty': messages.EMAIL_REQUIRED,
        }),

        city: Joi.string().min(2).required().trim().messages({
            'string.min': messages.CITY_TOO_SHORT,
            'any.required': messages.CITY_REQUIRED,
            'string.empty': messages.CITY_REQUIRED,
        }),

        frequency: Joi.string().required().messages({
            'any.required': messages.FREQUENCY_REQUIRED,
            'string.base': messages.FREQUENCY_INVALID,
            'string.empty': messages.FREQUENCY_REQUIRED,
        }),
    }),

    verifyEmailSchema: Joi.object({
        token: Joi.string().required().messages({
            'any.required': messages.TOKEN_REQUIRED,
            'string.empty': messages.TOKEN_REQUIRED,
        }),
    }),

    weatherParamsSchema: Joi.object({
        city: Joi.string().min(2).required().trim().messages({
            'string.min': messages.WEATHER_CITY_TOO_SHORT,
            'any.required': messages.WEATHER_CITY_REQUIRED,
            'string.empty': messages.WEATHER_CITY_REQUIRED,
        }),
    }),

    updateSubscriptionSchema: Joi.object({
        email: Joi.string().email().trim().messages({
            'string.email': messages.EMAIL_INVALID,
        }),

        city: Joi.string().min(2).trim().messages({
            'string.min': messages.CITY_TOO_SHORT,
        }),

        frequency: Joi.string().messages({
            'string.base': messages.FREQUENCY_INVALID,
        }),

        isActive: Joi.boolean(),
    }),
};

module.exports = schemas;
