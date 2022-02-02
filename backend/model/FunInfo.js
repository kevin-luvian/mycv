const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
  title: { type: String },
  description: { type: String },
  favicon: { type: String },
  type: { type: Number },
});

module.exports = mongoose.main_conn.model("FunInfo", schema);
