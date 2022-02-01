// Models
const Product = require('../models/Product')
const Event = require('../models/Event')
const HttpError = require('../models/HttpError')

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