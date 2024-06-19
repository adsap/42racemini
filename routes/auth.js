const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/connect', authController.connect);
router.post('/disconnect', authController.disconnect);
router.get('/webhook', authController.verifyWebhook);
router.post('/webhook', authController.webhook);

module.exports = router;