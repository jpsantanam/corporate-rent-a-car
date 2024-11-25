const sequelize = require('sequelize');

const database = new sequelize({
    dialect: 'sqlite',
    storage: './storage/database.sqlite'
});

module.exports = database;