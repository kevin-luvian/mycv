const router = require("express").Router();
const path = require("path");
const resf = require("./responseFactory");
const tokenAuth = require("../middleware/tokenAuth");
const upload = require("../middleware/uploadFile");
const fileRepo = require("../repository/fileRepository");
const fileMetadataRepo = require("../repository/fileMetadataRepository");
const util = require("../util/utils");
const FileMetadata = require("../model/FileMetadata");
const debug = util.log("router:file");

router.get("/", tokenAuth.admin, async (req, res) => {
  const files = fileMetadataRepo.addFilesUrl(
    req.headers.host,
    await fileMetadataRepo.retrieveLean()
  );
  resf.r200(res, "files found", files);
});

router.get("/:id/*", async (req, res) => {
  const id = util.stringToMongooseId(req.params.id);
  const file = await fileRepo.findFileById(id);
  if (!file) return resf.r400(res, "file not found");

  const metadata = await fileMetadataRepo.findById(id);
  const start = 0;
  const end = file.length - 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${file.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": file.length - start,
    "Content-Type": metadata.contentType,
  };
  res.writeHead(200, headers);

  const dstream = fileRepo.downloadStream(id);
  dstream.pipe(res);
});

router.post("/find-urls", async (req, res) => {
  const fileIds = req.body;
  const fileUrls = await fileMetadataRepo.getUrls(req.headers.host, fileIds);
  resf.r200(res, "files found", fileUrls);
});

router.delete("/:id", tokenAuth.admin, async (req, res) => {
  const id = util.stringToMongooseId(req.params.id);
  if (!id) return resf.r400(res, "invalid id");

  const filemetaDeleted = await fileMetadataRepo.deleteById(id);
  if (!filemetaDeleted) return resf.r500(res, "file metadata deletion failed");

  const fileDeleted = await fileRepo.deleteById(id);
  if (!fileDeleted) return resf.r500(res, "file deletion failed");

  resf.r200(res, "file deleted");
});

router.put("/:id", tokenAuth.admin, async (req, res) => {
  let { filename, group } = req.body;
  const id = util.stringToMongooseId(req.params.id);

  const file = await fileMetadataRepo.findById(id);
  if (!file) return resf.r404(res, "file not found");
  filename = matchFileExt(file.filename, filename);

  const success = await fileMetadataRepo.updateById(id, { filename, group });
  if (success) resf.r200(res, "file metadata updated");
  else resf.r500(res, "file metadata failed to update");
});

router.get("/page/:num", async (req, res) => {
  const pageNum = Math.max(req.params.num || 1, 1);
  const metadatas = await fileMetadataRepo.retrievePaginated(pageNum, 50);
  if (metadatas) {
    const files = fileMetadataRepo.addFilesUrl(
      req.headers.host,
      util.leanDocsCopy(metadatas.docs)
    );
    return resf.r200(res, "files found", files);
  }
  return resf.r400(res, "files not found");
});

router.post("/", tokenAuth.admin, upload, async (req, res) => {
  const id = await fileRepo.uploadStream(req);
  if (!id) return resf.r500(res, "Error uploading file");

  // Create a Metadata
  const fileMetaAttr = createFileMetadata(
    req.file,
    id,
    req.headers.filename,
    req.headers.group
  );
  const isCreated = await fileMetadataRepo.create(fileMetaAttr);

  if (isCreated) {
    resf.r200(res, "File uploaded successfully");
  } else {
    // failed to create, delete uploaded files
    fileRepo.deleteById(fileMetaAttr._id);
    resf.r500(res, "File Metadata creation failed");
  }
});

/**
 * match file extension from the original
 *
 * @param {string} original
 * @param {string} replacement
 * @return {string}
 */
const matchFileExt = (original, replacement) => {
  if (!replacement) return original;
  if (path.extname(original) === path.extname(replacement)) return replacement;
  return replacement + path.extname(original);
};

/**
 * create new file metadata object attributes
 *
 * @param {Express.Multer.File} mFile
 * @param {string} filename
 * @param {string} group
 * @return {Object}
 */
const createFileMetadata = (mFile, id, filename, group) => {
  return {
    _id: id,
    filename: matchFileExt(mFile.originalname, filename),
    group: group,
    contentType: mFile.mimetype,
    uploadDate: new Date(),
    size: mFile.size,
  };
};

const routeURL = "/api/file";

module.exports = { router, routeURL };
