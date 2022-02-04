const debug = require("../util/utils").log("repository:fileRepository");
const mongoose = require("../bin/mongoose");
const mongodb = require("mongodb");
const { Readable } = require("stream");

const file_connection = () => mongoose.file_conn.db;

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
  const modb = file_connection();
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
    const modb = file_connection();
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

/**
 * @param {number} id
 * @param {{
 * start: number
 * end: number
 * }} options
 */
const downloadStream = (id, options) => {
  const modb = file_connection();
  const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
  const downloadStream = bucket.openDownloadStream(id, options);
  return downloadStream;
};

/**
 * @returns {Promise<number?>}
 */
const uploadStream = (req) =>
  new Promise((resolve, reject) => {
    try {
      const minutes10 = 10 * 60 * 1000;
      req.socket.setTimeout(minutes10);

      console.log("Uploading");
      const readableTrackStream = new Readable();

      console.log(req.file);
      console.log();
      console.log("======================================================");
      console.log();
      console.log(req.file.buffer);

      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);

      const modb = file_connection();
      const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
      console.log("Bucket created");

      const uploadStream = bucket.openUploadStream();
      readableTrackStream.pipe(uploadStream);
      console.log("Upload stream created");

      uploadStream.on("error", (err) => {
        console.log("[Error] ", err);
        reject(null);
      });
      uploadStream.on("finish", () => resolve(uploadStream.id));
    } catch (err) {
      console.log("[Error] ", err);
    }
  });

const collection = "file";

module.exports = {
  deleteById,
  findFileById,
  downloadStream,
  uploadStream,
};
