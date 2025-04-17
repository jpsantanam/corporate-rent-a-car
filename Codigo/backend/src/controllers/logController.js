const logs = require('../models/log');

// Criar um novo log
exports.create = async (req, res, next) => {
    try {
        const user = JSON.parse(req.headers.usercookie);

        const newLog = {
            ...req.body,
            author: user.name
        };

        const log = await logs.create(newLog);
        res.status(200).send(log);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send(`Log com informações já cadastradas.`);
        } else {
            next(err);
        }
    }
};

// retornar todos os logs
exports.get = (req, res, next) => {
    if (req.query.startDate || req.query.endDate) {
        return filterLog(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    logs.findAll()
        .then(logs => {
            res.status(200).send(logs)
        }).catch(next);
}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allLogs = await logs.findAll();

        const filteredLogs = allLogs.filter(log => {
            const values = Object.values(log);
            return values.find(value => {
                const stringValue = value ? value.toString().toLowerCase() : '';
                return stringValue.includes(searchParam);
            });
        });

        if (filteredLogs.length === 0) {
            return res.status(404).send('Nenhum log encontrado com os parâmetros fornecidos.');
        }

        return res.status(200).send(filteredLogs);
    } catch (err) {
        next(err);
    }
}

// função de filtro por data de criação
const filterLog = async (req, res, next) => {
    const { Op } = require('sequelize');

    try {
        const { startDate, endDate, search } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const filteredLogs = await logs.findAll({ where: filters });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredLogs = filteredLogs.filter(log => {
                const values = Object.values(log.toJSON());
                return values.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredLogs.length === 0) {
                return res.status(404).send('Nenhum log encontrado com os parâmetros fornecidos.');
            }

            return res.status(200).send(searchFilteredLogs);
        }

        if (filteredLogs.length === 0) {
            return res.status(404).send('Nenhum log encontrado com os parâmetros fornecidos.');
        }

        return res.status(200).send(filteredLogs);
    } catch (err) {
        next(err);
    }
};