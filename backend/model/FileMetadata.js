const mongoose = require("../bin/mongoose");
const paginate = require("mongoose-paginate");

const schema = mongoose.file_conn.Schema({
  group: { type: String },
  filename: { type: String },
  contentType: { type: String },
  uploadDate: { type: Date },
  size: { type: Number },
  role: { type: Number },
});

schema.plugin(paginate);

module.exports = mongoose.file_conn.model("FileMetadata", schema);
