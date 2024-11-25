const users = require('../models/user');
const bcrypt = require('bcrypt');

// Criar um novo usuário
exports.create = async (req, res, next) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = {
            ...req.body,
            password: hashedPassword
        };

        const user = await users.create(newUser);
        res.status(200).send(user);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send(`Usuário com informações já cadastradas.`);
        } else {
            next(err);
        }
    }
};

//Atualizar um usuário
exports.update = (req, res, next) => {
    const newUser = req.body;
    const id = req.params.id;
    users.findByPk(id).then( user => {
        if (user) {
            if (newUser.password) {
                const isPasswordSame =  bcrypt.compare(newUser.password, user.password);
                if (isPasswordSame) {
                    return res.status(400).send('A nova senha deve ser diferente da senha atual');
                }
                const saltRounds = 10;
                newUser.password =  bcrypt.hash(newUser.password, saltRounds);
            }
            
            user.update(newUser, { where: { id } });   
            res.status(200).send(user);
        } else {
            res.status(404).send('Usuário não encontrado!');
        }
    }).catch(next);
}

// deletar um usuário
exports.delete = (req, res, next) => {
    const id = req.params.id;
    users.findByPk(id).then(user => {
        if (user) {
            user.destroy();
            res.status(200).send(user);
        } else {
            res.status(404).send('Usuário não encontrado!');
        }
    }
    ).catch(next);
}

// retornar um usuário específico
exports.getUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await users.findByPk(id)
        .catch(next);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send(`Usuário com id ${id} não encontrado!`);
    }
}

// retornar todos os usuários
exports.get = (req, res, next) => {
    if(req.query.startDate || req.query.endDate || req.query.role) {
        return filterUser(req, res, next);
    }
    if (req.query.search) {
        return getByQuery(req, res, next);
    }
    if (req.query.cpf) {
        return getByCpf(req, res, next);
    }
    users.findAll()
        .then(users => {
            res.status(200).send(users)
        }).catch(next);
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).send('Usuário não encontrado!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Senha incorreta!');
        }

        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
};

const getByQuery = async (req, res, next) => {
    try {
        const searchParam = req.query.search.toLowerCase();
        const allUsers = await users.findAll({ raw: true });

        const filteredUsers = allUsers.filter(user => {
            const values = Object.values(user);
            return values.find(value => {
                const stringValue = value ? value.toString().toLowerCase() : '';
                return stringValue.includes(searchParam);
            });
        });

        if(filteredUsers.length === 0) {
            return res.status(404).send('Nenhum usuário encontrado com os parâmetros fornecidos.');
        }

        return res.status(200).send(filteredUsers);
    } catch (err) {
        next(err);
    }
}

// função de filtro por data de criação e por enum de role
const filterUser = async (req, res, next) => {
    const { Op } = require('sequelize');

    try {
        const { startDate, endDate, role, search } = req.query;
        const filters = {};

        if (startDate || endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        if (role) {
            filters.role = role;
        }

        const filteredUsers = await users.findAll({ where: filters });

        if (search) {
            const searchParam = search.toLowerCase();
            const searchFilteredUsers = filteredUsers.filter(user => {
                const values = Object.values(user.toJSON());
                return values.some(value => {
                    const stringValue = value ? value.toString().toLowerCase() : '';
                    return stringValue.includes(searchParam);
                });
            });

            if (searchFilteredUsers.length === 0) {
                return res.status(404).send('Nenhum usuário encontrado com os parâmetros fornecidos.');
            }

            return res.status(200).send(searchFilteredUsers);
        }

        if (filteredUsers.length === 0) {
            return res.status(404).send('Nenhum usuário encontrado com os parâmetros fornecidos.');
        }

        return res.status(200).send(filteredUsers);
    } catch (err) {
        next(err);
    }
};

/*

// retornar um usuário específico
exports.getUser = async (req, res, next) => {
    const id = req.params.userId;
    const user = await users.findByPk(id)
        .catch(next);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send(`usuário com id ${id} não encontrado!`);
    }
};

// retornar todos os usuários
exports.get = (req, res, next) => {
    users.findAll().then(users => {
        res.status(200).send(users)
    }).catch(next);
};

// criar um novo usuário
exports.create = (req, res, next) => {
    users.create(req.body).then(u => res.status(200).send(u))
        .catch(next);
};

// atualizar um usuário
exports.update = (req, res, next) => {
    const newUser = req.body;
    const id = req.params.userId;
    users.findByPk(id).then(async (user) => {
        if (user) {
            await users.update(newUser, { where: { id } })
            res.status(200).send()
        } else {
            res.status(404).send();
        }
    }).catch(next);
};

// deletar um usuário
exports.delete = (req, res, next) => {
    const id = req.params.userId;
    users.destroy({ where: { id } }).then(res.status(200).send()).catch(next);
};
*/