const sequelize = require('sequelize');
const database = require('../database/db');

const user = database.define('user', {
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
            min: {
                args: 3,
            },
            max: {
                args: 50,
            }
        }
    },
    email: {
        type: sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,

    },
    role: {
        type: sequelize.ENUM('admin', 'operator'),
        defaultValue: 'operator',
        allowNull: false
    }
})

module.exports = user;