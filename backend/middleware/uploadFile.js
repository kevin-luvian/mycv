const multer = require("multer");
const resf = require("../routes/responseFactory");

const mb1000 = 1000 * 1000 * 1000;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fields: 1,
    files: 1,
    fileSize: mb1000,
  },
});
const uploadMiddleware = upload.single("file");

const uploadFile = (req, res, next) => {
  const minutes30 = 30 * 60 * 1000;
  req.socket.setTimeout(minutes30);

  uploadMiddleware(req, res, (err) => {
    if (err) return resf.r400(res, "Upload Request Validation Failed");
    return next();
  });
};

module.exports = uploadFile;
