require('dotenv').config();

const common = {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

module.exports = {
    development: {
        url: process.env.DB_URL,
        ...common,
    },
    test: {
        url: process.env.DB_URL,
        ...common,
    },
    production: {
        url: process.env.DB_URL,
        ...common,
    },
};
