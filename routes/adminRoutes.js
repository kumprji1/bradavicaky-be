const express = require('express');

const adminCtrl = require('../controllers/adminCtrl')
const adminVlds = require('../validations/adminVlds')

const readToken = require('../middlewares/readToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Below only authorized routes for admin
router.use(readToken, isAdmin) 

// Pupil management
router.get('/pupils', adminCtrl.getPupils)
router.post('/register-pupil', adminVlds.postRegisterPupil, adminCtrl.postRegisterPupil)

// Points management
router.patch('/add-points', adminCtrl.patchAddPointsById)
router.patch('/remove-points', adminCtrl.patchRemovePointsById)

// Product Management
router.get('/products', adminCtrl.getProducts)
router.get('/product/:productId', adminCtrl.getProductById)
router.patch('/edit-product/:productId', adminVlds.addOrEditProduct, adminCtrl.patchEditProduct)
router.post('/add-product', adminVlds.addOrEditProduct, adminCtrl.postAddProduct)
router.patch('/disable-product/:productId', adminCtrl.patchDisableProduct)

// Orders
router.get('/undelivered-orders', adminCtrl.getUndeliveredOrders)
router.patch('/deliver-order/:orderId', adminCtrl.patchDeliverOrder)

// Events
router.post('/add-event', adminVlds.postAddOrEditEvent, adminCtrl.postAddEvent)
router.delete('/event/:eventId', adminCtrl.deleteEvent)

// Questions
router.post('/add-question', adminVlds.postAddOrEditQuestion, adminCtrl.addQuestion)
router.patch('/edit-question/:questionId', adminVlds.postAddOrEditQuestion, adminCtrl.editQuestion)
router.delete('/question/:questionId', adminCtrl.deleteQuestion)

// Answers
router.post('/create-answer', adminVlds.postAddAnswer, adminCtrl.postCreateAnswer)
router.delete('/answer/:answerId', adminCtrl.deleteAnswer)


module.exports = router;