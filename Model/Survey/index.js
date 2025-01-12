const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    question: { type: String, required: true },
    answers: [
        {
            text: { type: String, required: true },
            points: { type: Number, required: true },
        },
    ],
});

const Servey = mongoose.model('Survey', SurveySchema);

module.exports = Servey
