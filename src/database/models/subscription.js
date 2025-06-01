'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subscription extends Model {
        static associate(models) {
            Subscription.belongsTo(models.Frequency, {
                foreignKey: 'frequencyId',
                as: 'Frequency',
            });
        }
    }

    Subscription.init({
        email: DataTypes.STRING,
        city: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        isVerified: DataTypes.BOOLEAN,
        verificationToken: DataTypes.STRING,
        frequencyId: DataTypes.INTEGER,
        lastSentAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Subscription',
    });
    return Subscription;
};