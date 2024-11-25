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
        validate: {
            len: [0, 100]
        }
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
        validate: {
            len: [0, 200]
        }
    },
    type:{
        type: sequelize.ENUM('preventiva', 'corretiva'),
    },
    situation:{
        type: sequelize.ENUM('concluido', 'pendente', 'aprovado', 'cancelada','aguardando peças', 'agendada'),
    }
});

maintenance.belongsTo(vehicle, {
    foreignKey: 'vehicleId',
    as: 'vehicle',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = maintenance;