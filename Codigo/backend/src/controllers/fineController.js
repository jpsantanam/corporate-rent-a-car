const fines = require('../models/fine');
const rents = require('../models/rent');
const { Op } = require('sequelize');
const logs = require('../controllers/logController');

//Criar um log de ação
async function createLog(req, res, next, action) {
    let vehicleRecord = {};

    if (action !== 'deletou') {
        vehicleRecord = await vehicles.findByPk(req?.body?.vehicleId);
    }

    const targetVehicle = vehicleRecord ? `do veículo ${vehicleRecord?.brand} ${vehicleRecord?.model} ${vehicleRecord?.motorization} ${vehicleRecord?.year}, ` : '';
    const targetFine = `ocorrida no dia ${new Date(req?.body?.dateFine).toLocaleDateString('pt-BR')}`;

    req.body = {
        action: action,
        entity: "uma multa",
        target: `${targetVehicle}${targetFine}`
    }

    logs.create(req, res, next);
}

//função para criar uma nova multa 
/* exports.create = (req, res, next) => {
    const newFine = req.body;
    const vehicleId = newFine.vehicleId;
    const fineDate = new Date(newFine.dateFine);

    rents.findAll({ where: { vehicleId: vehicleId } }).then(rentals => {
        if (rentals.length === 0) {
            res.status(404).send('Nenhum aluguel encontrado para este veículo!');
            return;
        }

        const rent = rentals.find(rental => {
            const rentStartDate = new Date(rental.startDate);
            const rentEndDate = new Date(rental.endDate);
            return fineDate >= rentStartDate && fineDate <= rentEndDate;
        });

        if (!rent) {
            res.status(404).send('Nenhum aluguel correspondente encontrado para a data da multa!');
            return;
        }
        newFine.rentId = rent.id;
        fines.create(newFine, { include: [rents] }).then(createdFine => {
            res.status(200).send(createdFine);
        }).catch(next);
    }).catch(next);
} */
exports.create = (req, res, next) => {
    const newFine = req.body;
    fines.create(newFine, { include: [rents] }).then(createdFine => {
        res.status(200).send(createdFine);

        createLog(req, res, next, "cadastrou");

    }).catch(err => {
        next(err);
    });
}

//função para atualizar uma multa
exports.update = (req, res, next) => {
    const newFine = req.body;
    const id = req.params.id;
    fines.findByPk(id, { include: [rents] }).then(fine => {
        if (fine) {
            if (newFine.rentId === null) {
                fine.setRent(null);
            }
            if (newFine.rentId && !fine.rent) {
                rents.findByPk(newFine.rentId).then(rent => {
                    if (rent) {
                        fine.setRent(rent);
                    } else {
                        res.status(404).send('Aluguel não encontrado!');
                    }
                }).catch(next);
            }
            if (newFine.rentId && fine.rent) {
                const newRent = newFine.rent;
                const rentId = fine.rent.id;
                rents.update(newRent, { where: { id: rentId } });
            }
            fine.update(newFine, { include: [rents] });
            res.status(200).send(fine);

            createLog(req, res, next, "atualizou");

        } else {
            res.status(404).send('Multa não encontrada!');
        }
    }).catch(next);
}


//função para buscar uma multa por id
exports.findById = (req, res, next) => {
    const id = req.params.id;
    fines.findByPk(id, { include: [rents] }).then(fine => {
        if (fine) {
            res.status(200).send(fine);
        } else {
            res.status(404).send('Multa não encontrada!');
        }
    }).catch(next);
}

//função para deletar uma multa
exports.delete = (req, res, next) => {
    const id = req.params.id;
    fines.findByPk(id, { include: [rents] }).then(fine => {
        if (fine) {
            fine.destroy();
            res.status(200).send(fine);

            createLog(req, res, next, "deletou");

        } else {
            res.status(404).send('Multa não encontrada!');
        }
    }).catch(next);
}

//função para listar todas as multas
exports.list = (req, res, next) => {
    if(req.query.startDate || req.query.endDate || req.query.type){
        filterFine(req, res, next);
        return;
    }
    if(req.query.search){
        filterFine(req, res, next);
        return;
    }
    fines.findAll({ include: [rents] }).then(fines => {
        if (fines.length === 0) {
            res.status(404).send('Nenhuma multa encontrada!');
        }
        res.status(200).send(fines);

    }).catch(next)
}

const filterFine = async (req, res, next) => {
    const { Op } = require('sequelize');
    try {
        const { startDate, endDate, search, type } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        if(Array.isArray(type)){
            filters.type = { [Op.in]: type };
        } else if(type){
            filters.type = type;
        }

        const filteredFines = await fines.findAll({
            where: filters,
            include: [{ model: rents }]
        });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredFines = filteredFines.filter(fine => {
                const fineValues = Object.values(fine.toJSON());
                const rentValues = fine.rent ? Object.values(fine.rent.toJSON()) : [];

                const allValues = [...fineValues, ...rentValues];

                return allValues.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredFines.length === 0) {
                return res.status(400).send(`Nenhuma multa encontrada com o parâmetro ${searchParam}`);
            }

            return res.status(200).send(searchFilteredFines);
        }

        if (filteredFines.length === 0) {
            return res.status(400).send('Nenhuma multa encontrada com os filtros informados');
        }

        res.status(200).send(filteredFines);
    } catch (error) {
        next(error);
    }
};

