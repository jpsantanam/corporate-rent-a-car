const sequelize = require('sequelize');
const database = require('../database/db');
const address = require('./address');
const representative = require('./representative');
const partner = require('./partner');

const company = database.define('company', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cnpj: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [14, 14]
        }
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 100]
        }
    },
    stateRegistration: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [9, 9]
        }
    }
})

company.hasOne(address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

company.hasMany(representative, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

company.hasMany(partner, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = company
