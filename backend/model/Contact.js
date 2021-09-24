const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    icon: { type: String },
    description: { type: String }
});

module.exports = mongoose.model("Contact", schema);