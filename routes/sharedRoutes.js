const express = require('express');

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

router.get('/products', sharedCtrl.getProducts)

router.get('/events', sharedCtrl.getEvents)

module.exports = router;