const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    level: { type: Number },
    category: { type: String }
});

module.exports = mongoose.model("Skill", schema);