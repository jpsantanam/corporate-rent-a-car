const router = require('express').Router();
const userController = require('../controllers/userController');

router.route('/')
    .post(userController.create)
    .get(userController.get)

router.route('/:id')
    .get(userController.getUser)
    .put(userController.update)
    .delete(userController.delete)

router.route('/login')
    .post(userController.login)

module.exports = router;