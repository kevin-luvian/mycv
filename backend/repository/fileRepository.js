const debug = require("../util/utils").log("repository:fileRepository");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Readable } = require("stream");
var GridStream = require("gridfs-stream");

/**
 * @param {*} id
 * @returns {Promise<{
 * _id: string
 * length: number
 * chunkSize: number
 * uploadDate: string
 * md5: string
 * }>}
 */
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

const downloadStream = (id, { start = undefined, end = undefined }) => {
  const modb = mongoose.connection.db;
  //   const gfs = GridStream(modb, mongodb);
  //   const readStream = gfs.createReadStream({ _id: id, root: "file" });

  //   //error handling, e.g. file does not exist
  //   readStream.on("error", function (err) {
  //     console.log("An error occurred!", err);
  //     throw err;
  //   });

  //   return readStream;

  const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
  const downloadStream = bucket.openDownloadStream(id, { start, end });
  return downloadStream;

  // downloadStream.
  // downloadStream.read(bytesToWriteTo);
  //   downloadStream.pipe(res, { end: true });

  //   downloadStream.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //   downloadStream.on("error", (err) => {
  //     debug("downloadStream", "on error:", err);
  //     res.status(404);
  //   });
  //   downloadStream.on("end", () => res.end());
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
