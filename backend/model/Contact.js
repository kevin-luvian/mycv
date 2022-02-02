const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    icon: { type: String },
    description: { type: String }
});

module.exports = mongoose.main_conn.model("Contact", schema);