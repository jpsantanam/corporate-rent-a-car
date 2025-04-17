const sequelize = require('sequelize');
const database = require('../database/db');
const address = require('./address');
const driverLicense = require('./driverLicense');
const rg = require('./rg');

const customer = database.define('customer', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cpf: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [11, 11]
        }
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    fatherName: {
        type: sequelize.STRING,
        allowNull: true,
        
    },
    motherName: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    maritalStatus: {
        type: sequelize.ENUM('solteiro', 'casado', 'separado', 'divorciado', 'viuvo'),
        defaultValue: 'solteiro',
        allowNull: false
    },
    birthday: {
        type: sequelize.DATE,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validatte: {
            isEmail: true
        }
    },
    telephone: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        
    },
    observation: {
        type: sequelize.STRING,
        allowNull: true,
        
    }
});

customer.hasOne(address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
customer.hasOne(rg, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
customer.hasOne(driverLicense, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = customer
