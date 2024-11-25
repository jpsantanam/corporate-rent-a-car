const vehicle = require('../models/vehicle');
const vehicles = require('../models/vehicle');
const maintenance = require('../models/maintenance');
const rents = require('../models/rent');
const customers = require('../models/customer');
const companies = require('../models/company');

//Criar um novo veículo
exports.create = (req, res, next) => {
    vehicles.create(req.body)
        .then(vehicle => res.status(200).send(vehicle))
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send(`Veículo com placa já cadastrada.`);
            } else {
                next(err);
            }
        })
}

//atualizar veículo
exports.update = (req, res, next) => {
    const newVehicle = req.body
    const id = req.params.id;
    vehicles.findByPk(id).then(async (vehicle) => {
        if (vehicle) {
            await vehicles.update(newVehicle, { where: { id: req.params.id } })
            res.status(200).send(vehicle);
        } else {
            res.status(404).send('Veículo não encontrado!');
        }
    }).catch(next)
}

// deletar um veículo
exports.delete = (req, res, next) => {
    const id = req.params.id;
    vehicles.findByPk(id).then(vehicle => {
        if (vehicle) {
            vehicles.destroy({ where: { id: id } });
            return res.status(200).send(vehicle);
        } else {
            res.status(404).send('Veículo não encontrado!');
        }
    }).then(() => {
        res.status(200).send(vehicle);
    }).catch(next);
}

// retornar um veículo específico
exports.getVehicle = async (req, res, next) => {
    const id = req.params.id;
    const vehicle = await vehicles.findByPk(id)
        .catch(next);
    if (vehicle) {
        res.status(200).send(vehicle);
    } else {
        res.status(404).send(`Veículo com id ${id} não encontrado!`);
    }
}

// retornar todos os veículos
exports.get = (req, res, next) => {
    if (req.query.startDate || req.query.endDate || req.query.motorization) {
        return filterVehicle(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    if (req.query.plate) {
        return getByPlate(req, res, next);
    }
    vehicles.findAll()
        .then(vehicle => res.status(200).send(vehicle))
        .catch(next);
}

//retornar todas as manutenções de um veiculo
exports.getMaintenances = (req, res, next) => {
    const id = req.params.id;
    maintenance.findAll({ where: { vehicleId: id } })
        .then(maintenances => {
            if (maintenances.length === 0) {
                return res.status(404).send(`Veículo com id ${id} não possui manutenções.`);
            }
            res.status(200).send(maintenances)
        }).catch(next);
}

//retornar todos os alugueis de um veiculo
exports.getRents = (req, res, next) => {
    const id = req.params.id;
    rents.findAll({ where: { vehicleId: id }, include: [vehicles, customers, companies] })
        .then(rents => {
            if (rents.length === 0) {
                return res.status(404).send(`Veículo com id ${id} não possui aluguéis.`);
            }
            res.status(200).send(rents)
        }).catch(next);
}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allVehicles = await vehicles.findAll({ raw: true, nest: true });

        const filteredVehicles = allVehicles.filter(vehicle => {
            const values = Object.values(vehicle);
            return values.find(value => {
                value != null && typeof value === 'object' ? value = JSON.stringify(Object.values(value)) : value;
                const stringValue = value ? value.toString().toLowerCase() : '';
                return stringValue.includes(searchParam);
            })
        })

        return res.json(filteredVehicles);
    } catch (err) {
        next(err);
    }
}


// retornar um veículo específico pela placa
const getByPlate = async (req, res, next) => {
    try {
        const plate = req.query.plate;
        const vehicle = await vehicles.findOne({ where: { plate: plate } });
        if (vehicle) {
            return res.status(200).send(vehicle);
        } else {
            return res.status(404).send(`Veículo com placa ${plate} não encontrado!`);
        }
    } catch (err) {
        next(err);
    }
}

const filterVehicle = async (req, res, next) => {
    const { Op } = require('sequelize');

    try {
        const { startDate, endDate, motorization, search } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        if (motorization) {
            filters.motorization = { [Op.like]: `%${motorization}%` };
        }

        const filteredVehicles = await vehicles.findAll({
            where: filters
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredVehicles = filteredVehicles.filter(vehicle => {
                const values = Object.values(vehicle.toJSON());
                return values.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredVehicles.length === 0) {
                return res.status(404).send(`Nenhum veículo encontrado com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredVehicles);
        }

        if (filteredVehicles.length === 0) {
            return res.status(404).send('Nenhum veículo encontrado com os filtros informados');
        }

        res.status(200).send(filteredVehicles);
    } catch (error) {
        next(error);
    }
};
