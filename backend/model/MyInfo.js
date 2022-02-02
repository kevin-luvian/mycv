const mongoose = require("../bin/mongoose");

const schema = mongoose.Schema({
  fullname: { type: String },
  phone: { type: String },
  gender: { type: Number },
  email: { type: String },
  address: { type: String },
  description: { type: String },
  professions: [{ type: String }],
  imageID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" },
  cvID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" },
});

module.exports = mongoose.main_conn.model("MyInfo", schema);
