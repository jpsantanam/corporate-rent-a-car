
const sequelize = require('sequelize');
const database = require('../database/db');

const partner = database.define('partner', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
        
    }
})

module.exports = partner;
