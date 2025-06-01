const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptions-controller');
const {validator} = require('../middlewares/validators');

router.post('/subscribe', validator.validateSubscription, controller.subscribe);
router.get('/confirm/:token', validator.validateToken, controller.confirmSubscription);
router.get('/unsubscribe/:token', validator.validateToken, controller.unsubscribe);

module.exports = router;