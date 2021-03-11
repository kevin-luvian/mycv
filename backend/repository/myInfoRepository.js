const MyInfo = require("../model/MyInfo");

/** 
 * find one MyInfo object in the database
 * 
 * @return {Promise<Object>} MyInfo object or null if not found
 */
const retrieve = async () => {
    let data = null;
    await MyInfo.find({}, (err, arr) => {
        if (!err && arr.length > 0) {
            for (let i = 1; i < arr.length; i++) {
                deleteById(arr[i]._id);
            }
            data = arr[0];
        }
    });
    return data;
}

/** 
 * delete MyInfo object by id
 * 
 * @param {string} id document _id
 */
const deleteById = async id => { await MyInfo.deleteOne({ _id: id }); }

/** 
 * find one MyInfo object by _id and update its value
 * 
 * @param {Object} myInfo object
 */
const update = async myInfo => {
    await MyInfo.findOneAndUpdate({ _id: myInfo._id }, myInfo, (err) => {
        if (err) console.log("[ error ] updating myInfo failed", err);
    });
}

/** 
 * save MyInfo object or update if database is not empty
 * 
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
            console.log("[ error ] saving myInfo failed", err);
        });
    }
}

module.exports = {
    retrieve,
    save
};