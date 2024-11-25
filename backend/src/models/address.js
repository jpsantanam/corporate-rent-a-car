const sequelize = require('sequelize');
const database = require('../database/db');

const address = database.define('address', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cep: {
        type: sequelize.NUMBER,
        allowNull: false,
        validate: {
            len: [8, 8]
        }
    },
    street: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    number: {
        type: sequelize.NUMBER,
        allowNull: false
    },
    complement: {
        type: sequelize.STRING
    },
    district: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    city: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    state: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 2]
        }
    }
});

module.exports = address;