const mongoose = require("mongoose");

const schema = mongoose.Schema({
    group: { type: String },
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date },
    size: { type: Number },
    role: { type: Number }
});

module.exports = mongoose.model("FileMetadata", schema);