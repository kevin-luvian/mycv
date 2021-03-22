const MyInfo = require("../model/MyInfo");
const util = require("../util/utils");
const debug = util.log("repository:myInfoRepository");

/** 
 * find one MyInfo object in the database
 * @return {Promise<Object>} MyInfo object or null if not found
 */
const retrieve = async () => {
    let data = await MyInfo.find({}).lean()
        .catch(err => debug("retrieve", "error:", err));
    if (data.length === 0) return undefined;
    else if (data.length > 1) deleteMany(data.slice(1));
    return data[0];
}

/**
 * @param {any[]} arr 
 */
const deleteMany = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        deleteById(arr[i]._id);
    }
}

/** 
 * delete MyInfo object by id
 * @param {string} id document _id
 */
const deleteById = async id => { await MyInfo.deleteOne({ _id: id }); }

/** 
 * delete MyInfo documents
 * @return {Promise<Boolean>} success
 */
const purge = async () => {
    const res = await MyInfo.deleteMany({})
        .catch(err => debug("purge", err));
    return res.ok === 1;
}

/** 
 * find one MyInfo object by _id and update its value
 * @param {Object} myInfo object
 */
const update = async myInfo => {
    await MyInfo.findOneAndUpdate({ _id: myInfo._id }, myInfo, (err) => {
        if (err) console.log("[ error ] updating myInfo failed", err);
    });
}

/** 
 * save MyInfo object or update if database is not empty
 * @param {Object} myInfo object
 * @return {Promise<void>} empty promise
 */
const save = async myInfo => {
    const data = await retrieve();
    if (data) {
        myInfo["_id"] = data._id;
        await update(myInfo);
    } else {
        await new MyInfo(myInfo).save().catch(err => {
            debug("save", "saving myInfo failed",
                "\ndata:", myInfo,
                "\nmessage:", err.message);
        });
    }
}

/**
 * @param {number} num 
 */
const constraintGender = num => util.constraint(0, 3, num);

module.exports = {
    constraintGender,
    retrieve,
    save,
    purge
};