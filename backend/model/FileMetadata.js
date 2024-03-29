const mongoose = require("mongoose");
const paginate = require("mongoose-paginate");

const schema = mongoose.Schema({
    group: { type: String },
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date },
    size: { type: Number },
    role: { type: Number }
});

schema.plugin(paginate);

module.exports = mongoose.model("FileMetadata", schema);