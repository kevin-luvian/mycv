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
  try {
    const id = util.stringToMongooseId(req.params.id);
    const file = await fileRepo.findFileById(id);
    if (!file) return resf.r400(res, "file not found");

    const metadata = await fileMetadataRepo.findById(id);

    const size = file.length;
    let range = req.headers.range;
    if (range == null && metadata.contentType.includes("video")) {
      range = "0";
    }

    if (range != null) {
      const parts = range.replace(/bytes=/, "").split("-");

      let start = parseInt(parts[0], 10);
      if (isNaN(start)) {
        start = 0;
      }

      const chunk3mb = 3 * 1000 * 1000;
      let end = parts[1] ? parseInt(parts[1], 10) : start + chunk3mb - 1;
      if (end > size - 1) {
        end = size - 1;
      }

      if (start > size - 1) {
        res.writeHead(416, {
          "Content-Range": `bytes */${size}`,
        });
        res.end();
        return;
      }

      const dstream = fileRepo.downloadStream(id, { start, end: end + 1 });

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": metadata.contentType,
      };
      res.writeHead(206, headers);
      dstream.pipe(res);
    } else {
      const head = {
        "Content-Length": size,
        "Content-Type": metadata.contentType,
      };
      res.writeHead(200, head);
      const dstream = fileRepo.downloadStream(id);
      dstream.pipe(res);
    }
  } catch (err) {
    resf.r500(res, "stream failed", err);
  }
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
  try {
    const minutes10 = 10 * 60 * 1000;
    req.socket.setTimeout(minutes10);

    const id = await fileRepo.uploadStream(req);
    if (!id) return resf.r500(res, "Error uploading file");

    console.log("File Upload Successfull");

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
  } catch (err) {
    const message = err ? err.message : "an error occured";
    resf.r500(res, message, err);
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
