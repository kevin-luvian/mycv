const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
  title: { type: String },
  place: { type: String },
  date: { type: String },
  description: { type: String },
  category: { type: String },
});

module.exports = mongoose.main_conn.model("Resume", schema);
