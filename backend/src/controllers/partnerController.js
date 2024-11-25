const partner = require('../models/partner');

exports.delete = (req, res, next) => {
    const id = req.params.id;
    partner.findByPk(id).then(partner => {
        if (partner) {
            partner.destroy();
            res.status(200).send(partner);
        } else {
            res.status(404).send('Parceiro não encontrado!');
        }
    }
    ).catch(next);
}

exports.update = (req, res, next) => {
    const newPartner = req.body;
    const id = req.params.id;
    partner.findByPk(id).then(partner => {
        if (partner) {
            partner.update(newPartner);
            res.status(200).send(partner);
        } else {
            res.status(404).send('Parceiro não encontrado!');
        }
    }).catch(next)
}