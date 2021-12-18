const express = require('express');

const pupilCtrl = require('../controllers/pupilCtrl');

const readToken = require('../middlewares/readToken');
const isPupil = require('../middlewares/isPupil');

const router = express.Router();

router.get('/points/:username', pupilCtrl.getPointsByUsername)

router.get('/avaible-products', pupilCtrl.getAvaibleProducts)

// Below only authorized routes for pupil
router.use(readToken, isPupil) 

router.post('/buy-product/:productId', pupilCtrl.postBuyProduct)

module.exports = router;