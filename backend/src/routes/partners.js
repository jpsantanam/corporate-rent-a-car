const router = require('express').Router()
const partnerController = require('../controllers/partnerController')

router.route('/:id')
    .delete(partnerController.delete)
    .put(partnerController.update)

module.exports = router