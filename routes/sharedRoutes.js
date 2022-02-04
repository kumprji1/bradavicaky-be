const express = require('express');

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

router.get('/products', sharedCtrl.getProducts)

router.get('/events', sharedCtrl.getEvents)

router.get('/questions', sharedCtrl.getQuestions)
router.get('/question/:questionId', sharedCtrl.getQuestionById)

router.get('/answers-of-question/:questionId', sharedCtrl.getAnswersOfQuesntionById)
router.get('/votes-of-question/:questionId', sharedCtrl.getVotesOfQuestionById)

module.exports = router;