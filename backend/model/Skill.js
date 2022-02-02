const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
  title: { type: String },
  level: { type: Number },
  category: { type: String },
});

module.exports = mongoose.main_conn.model("Skill", schema);
