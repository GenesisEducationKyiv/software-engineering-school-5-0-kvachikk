'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const models = {};

models.Frequency = require('./frequency')(sequelize, Sequelize.DataTypes);
models.Subscription = require('./subscription')(sequelize, Sequelize.DataTypes);

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models;
