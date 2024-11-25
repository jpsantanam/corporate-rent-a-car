const sequelize = require('sequelize');
const database = require('../database/db');
const maintenance = require('./maintenance');

const vehicle = database.define('vehicle', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    plate: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: [7, 7]
        }
    },
    fleet: {
        type: sequelize.STRING,
        allowNull: false,
    },
    year: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: [4, 4]
        }
    },
    model: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    brand: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    motorization: {
        type: sequelize.ENUM('1.0',',1.2','1.3' ,'1.4', '1.6', '1.8', '2.0', '2.2', '2.4', '2.6', '2.8', '3.0'),
        allowNull: false
    }
});

module.exports = vehicle;