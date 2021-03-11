const router = require('express').Router();
const path = require('path');
const resf = require("./responseFactory");
const tokenAuth = require("../middleware/tokenAuth");
const upload = require("../middleware/uploadFile");
const fileRepo = require("../repository/fileRepository");
const fileMetadataRepo = require("../repository/fileMetadataRepository");
const debug = require("../util/utils").log("router:file");

router.get('/', async (req, res) => {
    const files = fileMetadataRepo.addFileUrl(req.headers.host, await fileMetadataRepo.retrieveLean());
    resf.r200(res, "files found", files);
});

router.post('/', tokenAuth.admin, upload, async (req, res) => {
    if (!req.file)
        return resf.r400(res, "You must select a file");

    let filename = req.file.originalname;
    // replace filename if provided in header
    if (req.headers.filename)
        filename = matchFileExt(req.file.originalname, req.headers.filename);
    debug("POST", "filename:", filename);

    // Create a Metadata
    const fileMetaAttr = createFileMetadata(req.file, filename, req.group);
    const isCreated = await fileMetadataRepo.create(fileMetaAttr);
    debug("POST", "fileMetaAttr:", fileMetaAttr);

    // failed to create, delete uploaded files
    if (!isCreated) {
        fileRepo.deleteById(fileMetaAttr._id);
        return resf.r400(res, "File Metadata creation failed.");
    }

    fileRepo.deleteById(fileMetaAttr._id);

    resf.r200(res, "upload successful");
});

/**
 * match file extension from the original
 * 
 * @param {string} original 
 * @param {string} replacement 
 * @return {string}
 */
const matchFileExt = (original, replacement) => {
    if (path.extname(original) === path.extname(replacement))
        return replacement;
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
const createFileMetadata = (mFile, filename, group) => {
    return {
        filename: filename,
        group: group,
        _id: mFile.id,
        contentType: mFile.contentType,
        uploadDate: mFile.uploadDate,
        size: mFile.size
    };
};

const routeURL = "/api/file";

module.exports = { router, routeURL };