const sequelize = require('sequelize');
const database = require('../database/db');

const driverLicense = database.define('driverLicense', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    number: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    expirationDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    firstDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    category: {
        type: sequelize.ENUM('A', 'B', 'C', 'D', 'E'),
        allowNull: false
    },
    issuingBody: {
        type: sequelize.STRING,
        allowNull: false
    }
})

module.exports = driverLicense;