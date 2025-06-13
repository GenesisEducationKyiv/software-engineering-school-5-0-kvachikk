const config = require('../config/index');

module.exports = {
    test: {
        ...config.database.test,
    },

    development: {
        ...config.database.development,
    },

    production: {
        ...config.database.production,
    },
};
