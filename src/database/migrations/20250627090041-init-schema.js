'use strict';

const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('Subscriptions', {
         id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
         email: { type: DataTypes.STRING, allowNull: false },
         city: { type: DataTypes.STRING, allowNull: false },
         isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
         isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
         verificationToken: { type: DataTypes.STRING },
         frequency: { type: DataTypes.STRING, allowNull: false },
         lastSentAt: { type: DataTypes.DATE },
         createdAt: { type: DataTypes.DATE, allowNull: false },
         updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('Subscriptions');
   },
};
