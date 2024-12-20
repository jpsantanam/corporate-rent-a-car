const maintenance = require('../models/maintenance');
const vehicles = require('../models/vehicle');


//Criar uma nova manutenção
exports.create = (req, res, next) => {
    maintenance.create(req.body).then(maintenance => res.status(200).send(maintenance))
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send(`Manutenção já cadastrada`);
            } else {
                next(err);
            }
        })
}

//atualizar manutenção
exports.update = (req, res, next) => {
    const newMaintenance = req.body
    const id = req.params.id;
    maintenance.findByPk(id).then(async (maintenance) => {
        if (maintenance) {
            await maintenance.update(newMaintenance, { where: { id: req.params.id } })
            res.status(200).send(maintenance);
        } else {
            res.status(404).send('Manutenção não encontrada!');
        }
    }).catch(next)
}

// deletar uma manutenção
exports.delete = (req, res, next) => {
    const id = req.params.id;
    maintenance.findByPk(id).then(maintenanceRecord => {
        if (maintenanceRecord) {
            maintenance.destroy({ where: { id: id } });
            return res.status(200).send(maintenanceRecord);
        } else {
            res.status(404).send('Manutenção não encontrada!');
        }
    }).then(() => {
        res.status(200).send('Manutenção excluída com sucesso');
    }).catch(next);
}

// retornar uma manutenção específica
exports.getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const maintenanceRecord = await maintenance.findByPk(id, {
            include: [{ model: vehicles, as: 'vehicle' }]
        });
        if (maintenanceRecord) {
            res.status(200).send(maintenanceRecord);
        } else {
            res.status(404).send(`Manutenção com id ${id} não encontrada!`);
        }
    } catch (err) {
        next(err);
    }
}

// retornar todas as manutenções
exports.get = (req, res, next) => {
    if(req.query.startDate || req.query.endDate || req.query.type) {
        return filterMaintenance(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    maintenance.findAll({ include: [{ model: vehicles, as: 'vehicle' }] })
        .then(maintenaces => {
            res.status(200).send(maintenaces)
        }).catch(next);
}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allMaintenances = await maintenance.findAll({ raw: true, nest: true, include: [{ model: vehicles, as: 'vehicle' }] });

        const filteredMaintenances = allMaintenances.filter(maintenance => {
            const values = Object.values(maintenance);
            return values.find(value => {
                value != null && typeof value === 'object' ? value = JSON.stringify(Object.values(value)) : value;
                const stringValue = value ? value.toString().toLowerCase() : '';
                return stringValue.includes(searchParam);
            });
        });

        return res.json(filteredMaintenances);
    } catch (err) {
        next(err);
    }
}

const filterMaintenance = async (req, res, next) => {
    const { Op } = require('sequelize');
    try {
        const { startDate, endDate, search, type } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        if (type) {
            filters.type = type;
        }

        const filteredMaintenances = await maintenance.findAll({
            where: filters,
            include: [{ model: vehicles, as: 'vehicle' }]
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredMaintenances = filteredMaintenances.filter(maintenance => {
                const maintenanceValues = Object.values(maintenance.toJSON());
                const vehicleValues = maintenance.vehicle ? Object.values(maintenance.vehicle.toJSON()) : [];

                const allValues = [...maintenanceValues, ...vehicleValues];

                return allValues.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredMaintenances.length === 0) {
                return res.status(400).send(`Nenhuma manutenção encontrada com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredMaintenances);
        }

        if (filteredMaintenances.length === 0) {
            return res.status(400).send('Nenhuma manutenção encontrada com os filtros informados');
        }

        res.status(200).send(filteredMaintenances);
    } catch (error) {
        next(error);
    }
};