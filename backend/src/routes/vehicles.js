const router = require('express').Router();
const vehicleController = require('../controllers/vehicleController');

router.route('/')
    .post(vehicleController.create)
    .get(vehicleController.get)

router.route('/:id')
    .get(vehicleController.getVehicle)
    .put(vehicleController.update)
    .delete(vehicleController.delete)

router.route('/:id/maintenances')
    .get(vehicleController.getMaintenances)

router.route('/:id/rents')
    .get(vehicleController.getRents)

module.exports = router;
