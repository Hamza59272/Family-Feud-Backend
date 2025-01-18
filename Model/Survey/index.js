const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    question: { type: String, required: true },
    answers: [
        {
            text: { type: String, required: true },
            points: { type: Number, required: true },
        },
    ],
    playedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Family' }], // Tracks families that played this question
});

const Survey = mongoose.model('Survey', SurveySchema);

module.exports = Survey;
