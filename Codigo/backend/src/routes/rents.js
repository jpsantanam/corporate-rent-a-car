const router = require('express').Router();
const rentController = require('../controllers/rentController');

router.route('/')
    .post(rentController.create)
    .get(rentController.list)

router.route('/:id')
    .put(rentController.update)
    .delete(rentController.delete)
    .get(rentController.listOne)

router.route('/:id/fine')
    .get(rentController.getFines)

module.exports = router;