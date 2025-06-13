require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.URL,
    environment: process.env.RUN_ENVIROMENT || 'development',

    database: {
        test: {
            url: process.env.TEST_DB_URL,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        },
        development: {
            url: process.env.DEVELOPMENT_DB_URL,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        },
        production: {
            url: process.env.PRODUCTION_DB_URL,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        },
        get current() {
            switch (process.env.RUN_ENVIROMENT) {
                case 'test':
                    return this.test;
                case 'production':
                    return this.production;
                case 'development':
                default:
                    return this.development;
            }
        },
    },

    weatherApi: {
        baseUrl: process.env.OPEN_WEATHER_API_URL,
        coordinatesUrl: process.env.COORDINATES_API_URL,
        apiKey: process.env.OPEN_WEATHER_API_KEY,
    },

    mailProvider: {
        apiKey: process.env.MAIL_PROVIDER_API_KEY,
        senderEmail: process.env.MAIL_PROVIDER_SENDER_EMAIL,
    },
};

module.exports = config;
