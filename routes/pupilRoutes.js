const express = require('express');

const pupilCtrl = require('../controllers/pupilCtrl');

const readToken = require('../middlewares/readToken');
const isPupil = require('../middlewares/isPupil');

const router = express.Router();

router.get('/points/:username', pupilCtrl.getPointsByUsername)

router.get('/avaible-products', pupilCtrl.getAvaibleProducts)

// Below only authorized routes for pupil
router.use(readToken, isPupil) 

router.get('/undelivered-orders/:pupilId', pupilCtrl.getUndeliveredOrders)
router.get('/delivered-orders/:pupilId', pupilCtrl.getDeliveredOrders)

router.post('/buy-product/:productId', pupilCtrl.postBuyProduct)
// router.post('/refund-product/:productId', pupilCtrl.postRefundProduct)

router.post('/add-vote', pupilCtrl.postVote)

router.get('/can-roll/:pupilId', pupilCtrl.getCanRoll)
router.post('/roll', pupilCtrl.postRoll)

module.exports = router;