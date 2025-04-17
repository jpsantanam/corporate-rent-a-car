const router = require('express').Router()
const customerController = require('../controllers/customerController')

router.route('/')
    .post(customerController.create)
    .get(customerController.get)

router.route('/:id')
    .get(customerController.getCustomer)
    .put(customerController.update)
    .delete(customerController.delete)

router.route('/:id/rents')
    .get(customerController.getRents)

module.exports = router