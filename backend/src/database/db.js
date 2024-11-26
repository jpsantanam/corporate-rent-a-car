const sequelize = require('sequelize');

const database = new sequelize("postgresql://uxwcz1iaclhzha2kqmxy:Qf8jNkl74RA0bOw0ekLWrM8XD5Y5mi@by4nzkqtkk23zzsecxry-postgresql.services.clever-cloud.com:50013/by4nzkqtkk23zzsecxry", {
    dialect: 'postgres',
});

module.exports = database;