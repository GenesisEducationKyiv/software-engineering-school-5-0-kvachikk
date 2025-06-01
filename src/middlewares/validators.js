const {check, param, query, validationResult} = require('express-validator');

const validateSubscription = [
    check('email')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim()
        .notEmpty().withMessage('Email is required'),

    check('city')
        .notEmpty().withMessage('City is required')
        .trim()
        .isLength({min: 2}).withMessage('City name must be at least 2 characters long'),

    check('frequency')
        .notEmpty().withMessage('Frequency is required')
        .isString().withMessage('Frequency must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

const validateToken = [
    param('token')
        .notEmpty().withMessage('Token is required')
        .isString().withMessage('Token must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

const validateWeatherParams = [
    query('city')
        .notEmpty().withMessage('City parameter is required')
        .trim()
        .isLength({min: 2}).withMessage('City name must be at least 2 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = {
    validator: {
        validateSubscription,
        validateToken,
        validateWeatherParams
    }
};