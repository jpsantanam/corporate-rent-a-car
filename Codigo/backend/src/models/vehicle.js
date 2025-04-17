const sequelize = require('sequelize');
const database = require('../database/db');

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
        
    },
    model: {
        type: sequelize.STRING,
        allowNull: false,
       
    },
    brand: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    motorization: {
        type: sequelize.STRING,
        allowNull: false
    }
});

module.exports = vehicle;