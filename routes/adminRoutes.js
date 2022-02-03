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

// Events
router.post('/add-event', adminCtrl.postAddEvent)
router.delete('/event/:eventId', adminCtrl.deleteEvent)

// Questions
router.post('/add-question', adminCtrl.addQuestion)

// Answers
router.post('/create-answer', adminCtrl.postCreateAnswer)
router.delete('/answer/:answerId', adminCtrl.deleteAnswer)


module.exports = router;