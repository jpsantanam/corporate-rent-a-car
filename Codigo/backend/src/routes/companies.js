const router = require('express').Router();
const companyController = require('../controllers/companyController');

router.route('/')
    .post(companyController.create)
    .get(companyController.get)

router.route('/:id/partners')
    .get(companyController.getPartners)
    .post(companyController.addPartner)

router.route('/:id/representatives')
    .get(companyController.getRepresentatives)
    .post(companyController.addRepresentative)

router.route('/:id/rents')
    .get(companyController.getRents)

router.route('/:id')
    .get(companyController.getCompany)
    .put(companyController.update)
    .delete(companyController.delete)

module.exports = router;