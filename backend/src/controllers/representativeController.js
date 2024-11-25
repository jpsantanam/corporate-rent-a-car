const representative = require('../models/representative');

exports.delete = (req, res, next) => {
    const id = req.params.id;
    representative.findByPk(id).then(representative => {
        if (representative) {
            representative.destroy();
            res.status(200).send(representative);
        } else {
            res.status(404).send('Representante não encontrado!');
        }
    }
    ).catch(next);
}

exports.update = (req, res, next) => {
    const newRepresentative = req.body;
    const id = req.params.id;
    representative.findByPk(id).then(representative => {
        if (representative) {
            representative.update(newRepresentative);
            res.status(200).send(representative);
        } else {
            res.status(404).send('Representante não encontrado!');
        }
    }).catch(next)
}