const sequelize = require('sequelize');
const database = require('../database/db');

const log = database.define('log', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    author: {
        type: sequelize.STRING,
        allowNull: false,
    },
    action: {
        type: sequelize.STRING,
        allowNull: false,
    },
    entity: {
        type: sequelize.STRING,
        allowNull: false,
    },
    target: {
        type: sequelize.STRING,
        allowNull: false,
    },
})

module.exports = log;