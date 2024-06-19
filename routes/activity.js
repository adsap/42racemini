const router = require('express').Router();
const activityController = require('../controllers/activityController');

router.get('/', activityController.getAll);
router.get('/:activityId', activityController.getByActivityId);
router.delete('/:activityId', activityController.deleteByActivityId);

module.exports = router;