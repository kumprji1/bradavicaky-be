// Models
const Product = require('../models/Product')
const Event = require('../models/Event')
const HttpError = require('../models/HttpError');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Vote = require('../models/Vote');

// Returns all products
exports.getProducts = async (req, res, next) => {
    let products = [];
    try {
        products = await Product.find();
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst produkty', 500))
    }
    res.json(products)
}

exports.getEvents = async (req, res, next) => {
    let events = [];
    try {
        events = await Event.find();
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst události', 500))
    }
    res.json(events)
}

exports.getQuestions = async (req, res, next) => {
    let questions = [];
    try {
        questions = await Question.find();
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst otázky', 500))
    }
    res.json(questions)
}


exports.getQuestionById = async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.questionId);
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst otázku', 500))
    }
    res.json(question)
}

exports.getAnswersOfQuesntionById = async (req, res, next) => {
    let answers = [];
    try {
        answers = await Answer.find({questionId: req.params.questionId, deleted: false});
        console.log(answers)
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst odpovědi', 500))
    }
    res.json(answers)
}

exports.getVotesOfQuestionById = async (req, res, next) => {
    let votes = [];
    try {
        votes = await Vote.find({questionId: req.params.questionId});
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst hlasy', 500))
    }
    res.json(votes)
}
