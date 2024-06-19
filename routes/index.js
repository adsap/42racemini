const router = require('express').Router();
const authRoutes = require('./auth');
const accountRoutes = require('./account');
const activityRoutes = require('./activity');

router.use('/', authRoutes);
router.use('/account', accountRoutes);
router.use('/activity', activityRoutes);

module.exports = router