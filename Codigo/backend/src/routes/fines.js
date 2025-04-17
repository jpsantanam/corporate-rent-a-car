const router = require('express').Router();
const fineController = require('../controllers/fineController');

router.route('/')
    .post(fineController.create)
    .get(fineController.list)

router.route('/:id')
    .put(fineController.update)
    .delete(fineController.delete)
    .get(fineController.findById)

module.exports = router;

