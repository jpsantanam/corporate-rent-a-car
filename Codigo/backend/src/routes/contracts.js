const router = require('express').Router();
const contractController = require('../controllers/contractController');

router.post('/generate', contractController.createContract);

module.exports = router;