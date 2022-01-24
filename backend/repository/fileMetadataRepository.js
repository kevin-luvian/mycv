const debug = require("../util/utils").log("repository:fileMetadataRepository");
const FileMetadata = require("../model/FileMetadata");
const env = require("../util/envs");
const util = require("../util/utils");

/**
 * @typedef {Object} FileMetadata
 * @property {string} _id
 * @property {string} filename
 * @property {string} group
 * @property {string} contentType
 * @property {string} uploadDate
 * @property {number} size
 */

/**
 * find all File Metadata lean
 *
 * @return {Promise<Object[]>} Array of object
 */
const retrieveLean = () => FileMetadata.find().lean();

/**
 * find all File Metadata paginated
 * @param {number} page
 * @param {number} limit
 */
const retrievePaginated = (page, limit) => {
  /**
   * Response looks like:
   * {
   *   docs: [...] // array of Posts
   *   total: 42   // the total number of Posts
   *   limit: 10   // the number of Posts returned per page
   *   page: 2     // the current page of Posts returned
   *   pages: 5    // the total number of pages
   * }    */
  return FileMetadata.paginate({}, { page, limit });
  // .then(response => { })
  // .catch(handleQueryError);
};

/**
 * add url attribute
 *
 * @param {string} host host url
 * @param {Object[]} arr array of FileMetadata
 * @return {Object[]} modified array
 */
const addFilesUrl = (host, arr) => {
  // for (let i = 0; i < arr.length; i++) {
  //     arr[i]["url"] = fileUrl(host, arr[i]);
  // }
  return arr.map((file) => {
    file["url"] = fileUrl(host, file._id, file.filename);
    return file;
  });
};

/**
 * return url for file download
 * @param {string} host
 * @param {string} fileID
 * @param {string} filename
 * @returns {string}
 */
const fileUrl = (host, fileID, filename) => {
  const protocol = env.NODE_ENV === "development" ? "http" : "https";
  const routeURL = require("../routes/file").routeURL;
  filename = filename.replace(/\s+/g, "%20");
  return `${protocol}://${host}${routeURL}/${fileID}/${filename}`;
};

/**
 * create new FileMetadata
 *
 * note:
 * - should not have _id attribute
 *
 * @param {Object} obj
 * @return {Promise<Boolean>} success
 */
const create = async (obj) => {
  let success = true;
  await new FileMetadata(obj).save().catch((err) => {
    debug("create", "saving fm failed", err);
    success = false;
  });
  return success;
};

const updateById = async (id, data) => {
  const res = await FileMetadata.updateOne({ _id: id }, data);
  return res.ok === 1;
};

const deleteById = async (id) => {
  const res = await FileMetadata.deleteOne({ _id: id });
  return res.ok === 1;
};

/**
 * find File Metadata by id
 * @param {Types.ObjectId} id
 * @returns {Promise<FileMetadata>}
 */
const findById = (id) => FileMetadata.findOne({ _id: id }).lean();

const findFullById = async (host, id) => {
  const file = await findById(util.stringToMongooseId(id));
  if (!file) return null;

  file["url"] = fileUrl(host, file._id, file.filename);
  return file;
};

const getUrls = async (host, ids) => {
  const fileURLs = [];
  for (let i = 0; i < ids.length; i++) {
    const fileid = util.stringToMongooseId(ids[i]);
    const file = await findById(fileid);
    if (file) fileURLs.push(fileUrl(host, fileid, file.filename));
  }
  return fileURLs;
};

module.exports = {
  retrieveLean,
  retrievePaginated,
  addFilesUrl,
  create,
  getUrls,
  findById,
  updateById,
  deleteById,
  findFullById,
};
