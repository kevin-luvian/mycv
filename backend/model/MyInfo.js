const mongoose = require("mongoose");

const schema = mongoose.Schema({
    fullname: { type: String },
    email: { type: String },
    address: { type: String },
    description: { type: String },
    professions: [{ type: String }],
    imageID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" },
    cvID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" }
});

module.exports = mongoose.model("MyInfo", schema);