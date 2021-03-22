const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    description: { type: String },
    favicon: { type: String },
    type: { type: Number },
});

module.exports = mongoose.model("FunInfo", schema);