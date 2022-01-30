const express = require('express');

const adminCtrl = require('../controllers/adminCtrl');

const router = express.Router();

router.get('/pupils', adminCtrl.getPupils)

router.post('/register-pupil', adminCtrl.postRegisterPupil)

// Points management
router.patch('/add-points', adminCtrl.patchAddPointsById)
router.patch('/remove-points', adminCtrl.patchRemovePointsById)

// Product Management
router.get('/products', adminCtrl.getProducts)
router.post('/add-product', adminCtrl.postAddProduct)

// Orders
router.get('/undelivered-orders', adminCtrl.getUndeliveredOrders)
router.patch('/deliver-order/:orderId', adminCtrl.patchDeliverOrder)


module.exports = router;