const debug = require("../util/utils").log("repository:fileRepository");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Readable } = require("stream");

const findFileById = async (id) => {
  const modb = mongoose.connection.db;
  const file = await modb
    .collection(`${collection}.files`)
    .findOne({ _id: id })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      debug("findFileById", "error:", err);
      return null;
    });
  return file;
};

/**
 * delete file chunks and files by id
 *
 * @param {mongoose.Types.ObjectId} id file document id
 * @return {Promise<Boolean>} success
 */
const deleteById = async (id) => {
  try {
    const modb = mongoose.connection.db;
    const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
    bucket.delete(id, (err) => {
      if (err) {
        debug("deleteById", "error:", err.message, "\n", err);
        return false;
      }
    });
    return true;
  } catch (err) {
    debug("deleteById", "err:", err);
    return false;
  }
};

const downloadStream = (res, id) => {
  const modb = mongoose.connection.db;
  const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
  const downloadStream = bucket.openDownloadStream(id);

  // downloadStream.
  // downloadStream.read(bytesToWriteTo);
  downloadStream.pipe(res);

  // downloadStream.on('data', chunk => res.write(chunk));
  // downloadStream.on('error', err => {
  //     debug("downloadStream", "on error:", err);
  //     res.status(404)
  // });
  // downloadStream.on('end', () => res.end());
};

const uploadStream = (req) =>
  new Promise((resolve, reject) => {
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const modb = mongoose.connection.db;
    const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });

    const uploadStream = bucket.openUploadStream();
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => reject(null));
    uploadStream.on("finish", () => resolve(uploadStream.id));
  });

const collection = "file";

module.exports = {
  deleteById,
  findFileById,
  downloadStream,
  uploadStream,
};
