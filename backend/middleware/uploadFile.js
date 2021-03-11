const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
require("dotenv").config();

const storage = new GridFsStorage({
    url: process.env.MONGO_DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: () => { return { bucketName: "upload" }; }
});

const uploadFile = multer({ storage: storage }).single("file");
const uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;