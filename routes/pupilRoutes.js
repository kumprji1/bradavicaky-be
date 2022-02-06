const express = require('express');

const pupilCtrl = require('../controllers/pupilCtrl');

const readToken = require('../middlewares/readToken');
const isPupil = require('../middlewares/isPupil');

const router = express.Router();

// Below only authorized routes for pupil
router.use(readToken, isPupil) 

router.get('/points/:username', pupilCtrl.getPointsByUsername)

router.get('/avaible-products', pupilCtrl.getAvaibleProducts)

router.get('/undelivered-orders/:pupilId', pupilCtrl.getUndeliveredOrders)
router.get('/delivered-orders/:pupilId', pupilCtrl.getDeliveredOrders)

router.post('/buy-product/:productId', pupilCtrl.postBuyProduct)
// router.post('/refund-product/:productId', pupilCtrl.postRefundProduct)

// Vote
router.post('/add-vote', pupilCtrl.postVote)

// Try Luck
router.get('/can-roll/:pupilId', pupilCtrl.getCanRoll)
router.post('/roll', pupilCtrl.postRoll)

module.exports = router;