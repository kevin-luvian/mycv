const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    content: { type: String },
    order: { type: Number },
    root: { type: Boolean },
    type: { type: Number },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" }],
    childrens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Directory" }],
});

module.exports = mongoose.model("Directory", schema);