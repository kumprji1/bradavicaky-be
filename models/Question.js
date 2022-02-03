const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('Question', questionSchema)