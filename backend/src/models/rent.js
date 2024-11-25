const sequelize = require('sequelize');
const database = require('../database/db');
const vehicle = require('./vehicle');
const customer = require('./customer');
const company = require('./company');

const rent = database.define('rent',{
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    startDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    coverage:{
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [0, 30]
        }
    },
    status:{
        type: sequelize.BOOLEAN,
        allowNull: false

    },
    value:{
        type: sequelize.FLOAT,
        allowNull: false
    }
})

rent.belongsTo(vehicle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

rent.belongsTo(customer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


rent.belongsTo(company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = rent;