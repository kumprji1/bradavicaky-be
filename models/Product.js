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
        type: Number,
        required: true
    },
    // Remaining count of pieces left
    quantity: {
        type: Number,
        required: true
    },
    // Product is shown to pupils or not
    isHidden: {
        type: Boolean,
        required: false
    },
    deleted: {
        type: Boolean,
        required: false
    },
    // How many times can this product be bouhgt by one pupil (0 → unlimited)
    maxPiecesPerPupil: {
        type: Number,
        required: true
    },
    // Confirmed owners (Pupil really owns a product, that can't be refund)
    owners: [{
        ref: 'User',
        type: mongoose.Types.ObjectId,
        required: false
    }],
    // Pupil bought product, waiting for delivering, while he can refund
    orderedBy: [{
        ref: 'User',
        type: mongoose.Types.ObjectId,
        required: false
    }]
})

module.exports = mongoose.model('Product', productSchema)