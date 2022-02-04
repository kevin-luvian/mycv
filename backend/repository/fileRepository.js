const debug = require("../util/utils").log("repository:fileRepository");
const mongoose = require("../bin/mongoose");
const mongodb = require("mongodb");
const fs = require("fs");

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

      const filePath = req.file.path;

      console.log("Uploading");
      const readStream = fs.createReadStream(filePath);

      // console.log();
      // console.log("======================================================");
      // console.log(req.file);
      // console.log("======================================================");
      // console.log();

      const modb = file_connection();
      const bucket = new mongodb.GridFSBucket(modb, { bucketName: collection });
      console.log("Bucket created");

      const uploadStream = bucket.openUploadStream();
      readStream.pipe(uploadStream);

      uploadStream.on("error", (err) => {
        console.log("[Error] ", err);
        reject(null);
      });
      uploadStream.on("finish", () => {
        console.log("file saved");
        fs.unlink(filePath, () => {});
        resolve(uploadStream.id);
      });
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
