const debug = require("../util/utils").log("repository:fileRepository");
const mongoose = require("mongoose");

/**
 * delete upload chunks by id
 * 
 * @param {mongoose.Types.ObjectId} id file document id
 * @return {Promise<Boolean>} success
 */
const deleteChunkById = async id => {
    let success = false;
    const modb = mongoose.connection.db;
    await modb.collection('upload.chunks').deleteOne({ _id: id })
        .then(del => {
            success = del.result.ok === 1;
        }).catch(err => {
            debug("deleteChunkById", "error", err);
        });
    return success;
};

/**
 * delete upload files by id
 * 
 * @param {mongoose.Types.ObjectId} id file document id
 * @return {Promise<Boolean>} success
 */
const deleteFileById = async id => {
    let success = false;
    const modb = mongoose.connection.db;
    await modb.collection('upload.files').deleteOne({ _id: id })
        .then(del => {
            success = del.result.ok === 1;
        }).catch(err => {
            debug("deleteFileById", "error", err);
        });
    return success;
}

/**
 * delete upload chunks and files by id
 * 
 * @param {mongoose.Types.ObjectId} id file document id
 * @return {Promise<Boolean>} success
 */
const deleteById = async id => {
    const [dChunk, dFile] = await Promise.all([deleteChunkById(id), deleteFileById(id)]);
    debug("deleteById", "dChunk:", dChunk, "dFile:", dFile);
    return dChunk && dFile;
};

module.exports = {
    deleteById
}