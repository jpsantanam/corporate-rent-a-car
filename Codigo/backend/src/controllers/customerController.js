const customers = require('../models/customer')
const addresses = require('../models/address')
const rgs = require('../models/rg')
const driverLicenses = require('../models/driverLicense')
const logs = require('../controllers/logController');

//Criar um log de ação
function createLog(req, res, next, action) {
    req.body = {
        action: action,
        entity: "o(a) cliente(a)",
        target: req?.body?.name
    }

    logs.create(req, res, next);
}

//Criar um novo cliente 
exports.create = async (req, res, next) => {
    try {
        const customer = await customers.create(req.body, {
            include: [addresses, rgs, driverLicenses],
        });
        res.status(201).send(customer);

        createLog(req, res, next, "cadastrou");

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send('Cliente com informações já cadastradas.');
        } else if (err.name === 'SequelizeValidationError') {
            res.status(400).send('Erro de validação: ' + err.errors.map(e => e.message).join(', '));
        } else {
            next(err);
        }
    }
};

//atualizar um cliente
exports.update = (req, res, next) => {
    const newCustomer = req.body
    const id = req.params.id;
    customers.findByPk(id, { include: [addresses, rgs, driverLicenses] }).then(customer => {
        if (customer) {
            if (newCustomer.address) {
                const newAddress = newCustomer.address;
                const adressId = customer.address.id;
                addresses.update(newAddress, { where: { id: adressId } });
            }
            if (newCustomer.rg) {
                const newRg = newCustomer.rg;
                const rgId = customer.rg.id;
                rgs.update(newRg, { where: { id: rgId } });
            }
            if (newCustomer.driverLicense) {
                const newDriverLicense = newCustomer.driverLicense;
                const driverLicenseId = customer.driverLicense.id;
                driverLicenses.update(newDriverLicense, { where: { id: driverLicenseId } });
            }
            customer.update(newCustomer);
            res.status(200).send(customer);

            createLog(req, res, next, "atualizou");

        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    }).catch(next)
}

// deletar um cliente
exports.delete = (req, res, next) => {
    const id = req.params.id;
    customers.findByPk(id, { include: [addresses, rgs, driverLicenses] }).then(customer => {
        if (customer) {
            customer.destroy();
            res.status(200).send(customer);

            createLog(req, res, next, "deletou");

        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    }).catch(next);
}

// retornar um cliente específico
exports.getCustomer = async (req, res, next) => {
    const id = req.params.id;
    const customer = await customers.findByPk(id, { include: [addresses, rgs, driverLicenses] })
        .catch(next);
    if (customer) {
        res.status(200).send(customer);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}

// retornar todos os clientes
exports.get = (req, res, next) => {
    if (req.query.startDate || req.query.endDate) {
        return filterCustomer(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    if (req.query.cpf) {
        return getByCpf(req, res, next);
    }
    customers.findAll({ include: [addresses, rgs, driverLicenses] })
        .then(customers => {
            res.status(200).send(customers)
        }).catch(next);
}

exports.getRents = (req, res, next) => {
    const id = req.params.id;
    const rents = require('../models/rent');
    const vehicles = require('../models/vehicle');
    rents.findAll({ where: { customerId: id }, include: [vehicles, customers] })
        .then(rents => {
            if (rents.length === 0) {
                return res.status(404).send(`Cliente com id ${id} não possui alugueis.`);
            }
            res.status(200).send(rents);
        }).catch(next);
}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allCustomers = await customers.findAll({ include: [addresses, rgs, driverLicenses] });

        const filteredCustomers = allCustomers.filter(customer => {
            return JSON.stringify(customer).toLowerCase().includes(searchParam);
        });

        return res.status(200).send(filteredCustomers);
    } catch (err) {
        next(err);
    }
}

const getByCpf = async (req, res, next) => {
    try {
        const cpf = req.query.cpf;
        const customer = await customers.findOne({ where: { cpf: cpf }, include: [addresses, rgs, driverLicenses] });

        if (!customer) {
            return res.status(404).send(`Cliente com CPF ${cpf} não encontrado!`);
        }

        return res.status(200).send(customer);
    } catch (err) {
        next(err);
    }
}

const filterCustomer = async (req, res, next) => {
    const { Op } = require('sequelize');
    try {
        const { startDate, endDate, search } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const filteredCustomers = await customers.findAll({
            where: filters,
            include: [addresses, rgs, driverLicenses]
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredCustomers = filteredCustomers.filter(customer => {
                const customerValues = Object.values(customer.toJSON());
                const addressValues = customer.address ? Object.values(customer.address.toJSON()) : [];
                const rgValues = customer.rg ? Object.values(customer.rg.toJSON()) : [];
                const driverLicenseValues = customer.driverLicense ? Object.values(customer.driverLicense.toJSON()) : [];

                const allValues = [...customerValues, ...addressValues, ...rgValues, ...driverLicenseValues];

                return allValues.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredCustomers.length === 0) {
                return res.status(400).send(`Nenhum cliente encontrado com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredCustomers);
        }

        if (filteredCustomers.length === 0) {
            return res.status(400).send('Nenhum cliente encontrado com os filtros informados');
        }

        res.status(200).send(filteredCustomers);
    } catch (error) {
        next(error);
    }
};

//filtro por data de criação
exports.filterByDate = async (req, res, next) => {

    const { Op } = require('sequelize');

    try {
        const { startDate, endDate } = req.query;

        const customersList = await customers.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: [addresses, rgs, driverLicenses]
        });

        if (customersList.length === 0) {
            return res.status(404).send(`Nenhum cliente encontrado entre as datas ${startDate}`);
        }

        return res.status(200).send(customersList);
    } catch (err) {
        next(err);
    }
}