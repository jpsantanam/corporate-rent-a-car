const sequelize = require('sequelize');
const database = require('../database/db');

const representative = database.define('representative', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    position: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    department: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    phone: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
});

module.exports = representative;