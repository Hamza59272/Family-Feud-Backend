const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
});

const Family = mongoose.model('Family', FamilySchema);

module.exports = Family
