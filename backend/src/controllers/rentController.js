const rents = require('../models/rent');
const vehicles = require('../models/vehicle');
const customers = require('../models/customer');
const companies = require('../models/company');
const { Op } = require('sequelize');

//função para criar um novo aluguel
exports.create = (req, res, next) => {
    rents.create(req.body, {
        include: [vehicles, customers, companies],
    },).then(rent => res.status(200).send(rent))
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send(`Aluguel com informações já cadastradas.`);
            } else {
                next(err);
            }
        })
}

//função para atualizar um aluguel

exports.update = (req, res, next) => {
    const newRent = req.body;
    const id = req.params.id;
    rents.findByPk(id, { include: [vehicles, customers, companies] }).then(rent => {
        if (rent) {
            if (newRent.vehicleId === null) {
                rent.setVehicle(null);
            }
            if (newRent.vehicleId && !rent.vehicle) {
                vehicles.findByPk(newRent.vehicleId).then(vehicle => {
                    if (vehicle) {
                        rent.setVehicle(vehicle);
                    } else {
                        res.status(404).send('Veículo não encontrado!');
                    }
                }).catch(next);
            }
            if (newRent.vehicleId && rent.vehicle) {
                const newVehicle = newRent.vehicle;
                const vehicleId = rent.vehicle.id;
                vehicles.update(newVehicle, { where: { id: vehicleId } });
            }
            if (newRent.customerId === null) {
                rent.setCustomer(null);
            }
            if (newRent.customerId && !rent.customer) {
                customers.findByPk(newRent.customerId).then(customer => {
                    if (customer) {
                        rent.setCustomer(customer);
                    } else {
                        res.status(404).send('Cliente não encontrado!');
                    }
                }).catch(next);
            }
            if (newRent.customerId && rent.customer) {
                const newCustomer = newRent.customer;
                const customerId = rent.customer.id;
                customers.update(newCustomer, { where: { id: customerId } });
            }
            if (newRent.companyId === null) {
                rent.setCompany(null);
            }
            if (newRent.companyId && !rent.company) {
                companies.findByPk(newRent.companyId).then(company => {
                    if (company) {
                        rent.setCompany(company);
                    } else {
                        res.status(404).send('Empresa não encontrada!');
                    }
                }).catch(next);
            }

            if (newRent.companyId && rent.company) {
                const newCompany = newRent.company;
                const companyId = rent.company.id;
                companies.update(newCompany, { where: { id: companyId } });
            }
            rent.update(newRent).then(() => {
                return rent.reload({ include: [vehicles, customers, companies] });
            }).then(updatedRent => {
                res.status(200).send(updatedRent);
            }).catch(next);
        } else {
            res.status(404).send('Aluguel não encontrado!');
        }
    }).catch(next)
}

// função para deletar um aluguel
exports.delete = (req, res, next) => {
    const id = req.params.id;
    rents.findByPk(id, { include: [vehicles, customers, companies] }).then(rent => {
        if (rent) {
            rent.destroy();
            res.status(200).send(rent);
        } else {
            res.status(404).send('Aluguel não encontrado!');
        }
    }).catch(next)
}

// função para listar todos os alugueis
exports.list = (req, res, next) => {
    if(req.query.coverage || req.query.status || req.query.startDate || req.query.endDate || req.query.value || req.query.vehicleId || req.query.companyId || req.query.customerId ){
        filterRents(req, res, next);
        return;
    }
    if(req.query.search){
        getByQuery(req, res, next);
        return;
    }
    rents.findAll({ include: [vehicles, customers, companies] }).then(rents => {
        res.status(200).send(rents);
    }).catch(next)
}

// função para listar um aluguel
exports.listOne = (req, res, next) => {
    const id = req.params.id;
    rents.findByPk(id, { include: [vehicles, customers, companies] }).then(rent => {
        if (rent) {
            res.status(200).send(rent);
        } else {
            res.status(404).send('Aluguel não encontrado!');
        }
    }).catch(next)
}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allRents = await rents.findAll({ include: [vehicles, customers, companies] });

        const filteredRents = allRents.filter(rent => {
            const rentValues = Object.values(rent.toJSON());
            const vehicleValues = rent.vehicle ? Object.values(rent.vehicle.toJSON()) : [];
            const customerValues = rent.customer ? Object.values(rent.customer.toJSON()) : [];
            const companyValues = rent.company ? Object.values(rent.company.toJSON()) : [];

            const allValues = [...rentValues, ...vehicleValues, ...customerValues, ...companyValues];

            return allValues.some(value => {
                const stringValue = value ? value.toString().toLowerCase() : '';
                return stringValue.includes(searchParam);
            });
        });

        if (filteredRents.length === 0) {
            return res.status(400).send(`Nenhum aluguel encontrado com o parâmetro ${searchParam}`);
        }

        return res.status(200).send(filteredRents);
    } catch (err) {
        next(err);
    }
}

const filterRents = async (req, res, next) => {
    try {
        const { coverage, status, startDate, endDate, value, vehicleId, companyId, customerId, search } = req.query;
        const filters = {};

        if (coverage) {
            filters.coverage = { [Op.like]: `%${coverage}%` };
        }

        if (status !== undefined) {
            filters.status = status === 'true';
        }

        if (startDate) {
            filters.startDate = { [Op.gte]: new Date(startDate) };
        }

        if (endDate) {
            filters.endDate = { [Op.lte]: new Date(endDate) };
        }

        if (value) {
            filters.value = { [Op.eq]: parseFloat(value) };
        }

        if (vehicleId) {
            filters.vehicleId = vehicleId;
        }

        if (companyId) {
            filters.companyId = companyId;
        }

        if (customerId) {
            filters.customerId = customerId;
        }

        const filteredRents = await rents.findAll({
            where: filters,
            include: [vehicles, customers, companies]
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredRents = filteredRents.filter(rent => {
                const rentValues = Object.values(rent.toJSON());
                const vehicleValues = rent.vehicle ? Object.values(rent.vehicle.toJSON()) : [];
                const customerValues = rent.customer ? Object.values(rent.customer.toJSON()) : [];
                const companyValues = rent.company ? Object.values(rent.company.toJSON()) : [];

                const allValues = [...rentValues, ...vehicleValues, ...customerValues, ...companyValues];

                return allValues.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredRents.length === 0) {
                return res.status(400).send(`Nenhum aluguel encontrado com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredRents);
        }

        if(filteredRents.length === 0){
            return res.status(400).send('Nenhum aluguel encontrado com os filtros informados');
        }
        res.status(200).send(filteredRents);
    } catch (error) {
        next(error);
    }
};
