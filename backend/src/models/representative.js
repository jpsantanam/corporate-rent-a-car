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
        validate: {
            len: [3, 50]
        }
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
        validate: {
            len: [3, 50]
        }
    },
    department: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    phone: {
        type: sequelize.NUMBER,
        allowNull: false,
        validate: {
            len: [8, 14]
        }
    },
});

module.exports = representative;