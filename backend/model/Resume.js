const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    place: { type: String },
    date: { type: String },
    description: { type: String },
    category: { type: String }
});

module.exports = mongoose.model("Resume", schema);