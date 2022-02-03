const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const answerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    questionId: {
        type: mongoose.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    deleted: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('Answer', answerSchema)