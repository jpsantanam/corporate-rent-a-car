const companies = require('../models/company');
const addresses = require('../models/address');
const representatives = require('../models/representative');
const partner = require('../models/partner');
const logs = require('../controllers/logController');

//Criar um log de ação
function createLog(req, res, next, action) {
    req.body = {
        action: action,
        entity: "a empresa",
        target: req?.body?.name
    }

    logs.create(req, res, next);
}

//Criar um novo cliente empresarial
exports.create = (req, res, next) => {
    companies.create(req.body, {
        include: [addresses, representatives, partner],
    }).then(company => {
        res.status(200).send(company);

        createLog(req, res, next, "cadastrou");

    }).catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send(`Cliente com informações já cadastradas.`);
        } else {
            next(err);
        }
    });
}

//atualizar cliente empresarial
exports.update = (req, res, next) => {
    const newCompany = req.body;
    const id = req.params.id;
    companies.findByPk(id, { include: [addresses, representatives, partner] }).then(company => {
        if (company) {
            if (newCompany.address) {
                const newAddress = newCompany.address;
                const addressId = company.address.id;
                addresses.update(newAddress, { where: { id: addressId } });
            }
            if (newCompany.representative) {
                const newRepresentative = newCompany.representative;
                const representativeId = company.representative.id;
                representatives.update(newRepresentative, { where: { id: representativeId } });
            }
            /*
            if (newCompany.partners) {
                const newPartners = newCompany.partners;
                const partnersId = company.partners.id;
                partner.update(newPartners, { where: { id: partnersId } });
            }
            */
            company.update(newCompany);
            res.status(200).send(company);

            createLog(req, res, next, "atualizou");

        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    }).catch(next)
}

// deletar um cliente empresarial
exports.delete = (req, res, next) => {
    const id = req.params.id;
    companies.findByPk(id, { include: [addresses, representatives, partner] }).then(company => {
        if (company) {
            company.destroy();
            res.status(200).send(company);

            createLog(req, res, next, "deletou");

        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    }).catch(next);
}

// retornar um cliente empresarial específico
exports.getCompany = async (req, res, next) => {
    const id = req.params.id;
    const company = await companies.findByPk(id, { include: [addresses, representatives, partner] })
        .catch(next);
    if (company) {
        res.status(200).send(company);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}

// retornar todos os cliente empresariais
exports.get = (req, res, next) => {
    if (req.query.startDate || req.query.endDate) {
        return filterCompany(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    if (req.query.cnpj) {
        return getByCnpj(req, res, next);
    }
    companies.findAll({ include: [addresses, representatives, partner] })
        .then(companies => {
            res.status(200).send(companies)
        }).catch(next);
}

exports.getPartners = async (req, res, next) => {
    const id = req.params.id;
    const company = await companies.findByPk(id, { include: [partner] }).catch(next);
    if (company) {
        res.status(200).send(company.partners);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}

exports.addPartner = async (req, res, next) => {
    const id = req.params.id;
    const company = await companies.findByPk(id, { include: [partner] }).catch(next);
    if (company) {
        const newPartner = req.body;
        partner.create(newPartner).then(partner => {
            company.addPartner(partner);
            res.status(200).send(partner);
        }).catch(next);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}

exports.getRepresentatives = async (req, res, next) => {
    const id = req.params.id;
    const company = await companies.findByPk(id, { include: [representatives] }).catch(next);
    if (company) {
        res.status(200).send(company.representatives);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}

exports.addRepresentative = async (req, res, next) => {
    const id = req.params.id;
    const company = await companies.findByPk(id, { include: [representatives] }).catch(next);
    if (company) {
        const newRepresentative = req.body;
        representatives.create(newRepresentative).then(representative => {
            company.addRepresentative(representative);
            res.status(200).send(representative);
        }).catch(next);
    } else {
        res.status(404).send(`Cliente com id ${id} não encontrado!`);
    }
}


exports.getRents = (req, res, next) => {
    const id = req.params.id;
    const rents = require('../models/rent');
    const vehicles = require('../models/vehicle');
    rents.findAll({ where: { companyId: id }, include: [vehicles, companies] })
        .then(rents => {
            if (rents.length === 0) {
                return res.status(404).send(`Nenhum aluguel encontrado para o cliente com id ${id}`);
            }
            res.status(200).send(rents);
        }).catch(next);

}

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allCompanies = await companies.findAll({ include: [addresses, representatives, partner] });

        const filteredCompanies = allCompanies.filter(company => {
            return JSON.stringify(company).toLowerCase().includes(searchParam);
        });

        return res.status(200).send(filteredCompanies);
    } catch (err) {
        next(err);
    }
}

const getByCnpj = async (req, res, next) => {
    try {
        const cnpj = req.query.cnpj;
        const company = await companies.findOne({ where: { cnpj: cnpj }, include: [addresses, representatives, partner] });

        if (!company) {
            return res.status(404).send(`Cliente com CNPJ ${cnpj} não encontrado!`);
        }

        return res.status(200).send(company);
    } catch (err) {
        next(err);
    }
}

const filterCompany = async (req, res, next) => {
    const { Op } = require('sequelize');
    try {
        const { startDate, endDate, search } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const filteredCompanies = await companies.findAll({
            where: filters,
            include: [addresses, representatives, partner]
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredCompanies = filteredCompanies.filter(company => {
                const companyValues = Object.values(company.toJSON());
                const addressValues = company.address ? Object.values(company.address.toJSON()) : [];
                const representativeValues = company.representative ? Object.values(company.representative.toJSON()) : [];
                const partnerValues = company.partner ? Object.values(company.partner.toJSON()) : [];

                const allValues = [...companyValues, ...addressValues, ...representativeValues, ...partnerValues];

                return allValues.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredCompanies.length === 0) {
                return res.status(400).send(`Nenhum cliente encontrado com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredCompanies);
        }

        if (filteredCompanies.length === 0) {
            return res.status(400).send('Nenhum cliente encontrado com os filtros informados');
        }

        res.status(200).send(filteredCompanies);
    } catch (error) {
        next(error);
    }
};
