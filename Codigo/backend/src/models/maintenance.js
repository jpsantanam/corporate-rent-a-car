const sequelize = require('sequelize');
const database = require('../database/db');
const vehicle = require('./vehicle');

const maintenance = database.define('maintenance', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    mechanics: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    reviewDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    nextReviewDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    kilometers: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    observation: {
        type: sequelize.STRING,
        allowNull: false,
        
    },
    type:{
        type: sequelize.ENUM('preventiva', 'corretiva'),
    },
    situation:{
        type: sequelize.ENUM('concluido', 'pendente', 'aprovado', 'cancelada','aguardando peças', 'agendada', 'finalizada'),
    }
});

maintenance.belongsTo(vehicle, {
    foreignKey: 'vehicleId',
    as: 'vehicle',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = maintenance;