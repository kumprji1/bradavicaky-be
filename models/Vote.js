const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const voteSchema = new Schema({
    createdAt: {
        type: Date,
        required: true
    },
    questionId: {
        type: mongoose.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Answer',
        required: true
    },
    pupilId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Vote', voteSchema)