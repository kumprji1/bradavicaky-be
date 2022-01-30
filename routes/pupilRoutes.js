const express = require('express');

const pupilCtrl = require('../controllers/pupilCtrl');

const readToken = require('../middlewares/readToken');
const isPupil = require('../middlewares/isPupil');

const router = express.Router();

router.get('/points/:username', pupilCtrl.getPointsByUsername)

router.get('/avaible-products', pupilCtrl.getAvaibleProducts)

// Below only authorized routes for pupil
router.use(readToken, isPupil) 

router.get('/ordered-products/:pupilId', pupilCtrl.getOrderedProducts)
router.get('/delivered-products/:pupilId', pupilCtrl.getDeliveredProducts)

router.post('/buy-product/:productId', pupilCtrl.postBuyProduct)
router.post('/refund-product/:productId', pupilCtrl.postRefundProduct)

module.exports = router;