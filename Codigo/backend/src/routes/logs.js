const router = require('express').Router()
const logController = require('../controllers/logController')

router.route('/')
    .post(logController.create)
    .get(logController.get)

/* router.route('/:id')
    .get(logController.getLog)
    .put(logController.update)
    .delete(logController.delete) */

module.exports = router