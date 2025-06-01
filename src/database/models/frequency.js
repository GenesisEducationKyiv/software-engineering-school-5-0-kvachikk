'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Frequency extends Model {

        static associate(models) {
            Frequency.hasMany(models.Subscription, {
                foreignKey: 'frequencyId',
                as: 'subscriptions',
            });
        }
    }

    Frequency.init({
        title: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Frequency',
    });
    return Frequency;
};