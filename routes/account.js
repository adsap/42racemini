const router = require('express').Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.getAll);
router.get('/:athleteId', accountController.getByAthleteId);

module.exports = router;