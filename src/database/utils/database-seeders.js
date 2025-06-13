const sequelize = require('../sequelize');
const Frequency = require('../models/frequency')(
    sequelize,
    require('sequelize').DataTypes
);
const frequencySeedData = require('../../constants/seed-data/frequency-seed-data');

const seedFrequencies = async () => {
    if ((await Frequency.count()) > 0) return;
    await Frequency.bulkCreate(frequencySeedData);
};

module.exports = seedFrequencies;
