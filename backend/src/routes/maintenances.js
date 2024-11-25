const router = require('express').Router();
const maintenanceController = require('../controllers/maintenanceController');

router.route('/')
    .post(maintenanceController.create)
    .get(maintenanceController.get)

router.route('/:id')
    .get(maintenanceController.getById)
    .put(maintenanceController.update)
    .delete(maintenanceController.delete)


module.exports = router;