const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderschema = new Schema({
    pupilId: {
        ref: 'User',
        type: mongoose.Types.ObjectId,
        required: true
    },
    productId: {
        ref: 'Product',
        type: mongoose.Types.ObjectId,
        required: true
    },
    orderedAt: {
        type: Date,
        required: true
    }, 
    // done: FALSE → preordered, pupil can refund
    // done: TRUE → delivered
    delivered: {
        type: Boolean,
        required: true
    },
    deliveredAt: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('Order', orderschema)