const debug = require("../util/utils").log("repository:fileMetadataRepository");
const FileMetadata = require("../model/FileMetadata");

/** 
 * find all File Metadata lean
 * 
 * @return {Promise<Object[]>} Array of object
 */
const retrieveLean = () => { return FileMetadata.find().lean(); };

/** 
 * add url attribute
 * 
 * @param {string} host host url
 * @param {Object[]} arr array of FileMetadata
 * @return {Object[]} modified array
 */
const addFileUrl = (host, arr) => {
    const fileurl = host + require("../routes/file").routeURL;
    for (let i = 0; i < arr.length; i++) {
        arr[i]["url"] = `http://${fileurl}/` +
            `${arr[i]._id}/` +
            arr[i].filename.replace(/\s+/g, "%20");
    }
    return arr;
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
const create = async obj => {
    let success = true;
    await new FileMetadata(obj).save().catch(err => {
        debug("create", "saving fm failed", err);
        success = false;
    });
    return success;
};

module.exports = { retrieveLean, addFileUrl, create }