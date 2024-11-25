const sequelize = require('sequelize');
const database = require('../database/db');
const rent = require('./rent');

const fine = database.define('fine',{
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    value:{
        type: sequelize.FLOAT,
        allowNull: false
    },
    status:{
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    code:{
        type: sequelize.STRING,
        allowNull: false
    },
    dateFine:{
        type: sequelize.DATE,
        allowNull: false
    },
    observation:{
        type: sequelize.STRING,
        allowNull: false
    },
    location:{
        type: sequelize.STRING,
        allowNull: false
    },
    type:{
        type: sequelize.ENUM('Leve', 'Media', 'Grave', 'Gravissima'),
        allowNull: false
    }
})

fine.belongsTo(rent, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = fine;