const router = require('express').Router()
const representativeController = require('../controllers/representativeController')

router.route('/:id')
    .delete(representativeController.delete)
    .put(representativeController.update)

module.exports = router