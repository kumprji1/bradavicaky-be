const express = require('express');

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

router.get('/products', sharedCtrl.getProducts)

module.exports = router;