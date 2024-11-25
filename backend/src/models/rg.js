const sequelize = require('sequelize');
const database = require('../database/db');

const rg = database.define('rg', {
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
    state: {
        type: sequelize.STRING,
        allowNull: false
    },
    issuingBody: {
        type: sequelize.STRING,
        allowNull: false
    },
    issuingDate: {
        type: sequelize.DATE,
        allowNull: false
    }
})

module.exports = rg;