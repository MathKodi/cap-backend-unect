const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    available: { type: Boolean, default: true },
    user: Object,
    adopter: Object,
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);