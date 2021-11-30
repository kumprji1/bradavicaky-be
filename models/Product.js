const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    isHidden: {
        type: String,
        required: false
    },
    owners: [{
        ref: 'User',
        type: mongoose.Types.ObjectId,
        required: false
    }]
})

module.exports = mongoose.model('Product', productSchema)