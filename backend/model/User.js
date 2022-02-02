const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String, maxlength: 100 },
  role: { type: Number },
});

module.exports = mongoose.main_conn.model("User", schema);
