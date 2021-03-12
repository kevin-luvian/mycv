const mongoose = require("mongoose");

/** 
 * convert to mongoose ObjectId or null if error
 * 
 * @param {string} str - string body
 * @return {mongoose.Types.ObjectId} splitted string
 */
const stringToMongooseId = str => {
    try {
        return mongoose.Types.ObjectId(str);
    } catch (e) {
        return null;
    }
}

/** 
 * split string to list of string by separator.
 * 
 * @param {string} str - string body
 * @param {string} separator - separating char
 * @return {string[]} splitted string
 */
const stringToList = (str, separator) => {
    if (!str) return [""];
    const strList = str.split(separator);
    strList.forEach((s, i, arr) => { arr[i] = s.trim(); });
    return strList;
}

/**
 * log with leading debug string
 * 
 * @param {string} rootTag 
 * @return {function} logging function
 */
const log = rootTag => (tag, ...args) => { console.log(`[ ${rootTag}:${tag} ]`, ...args); }

module.exports = {
    stringToList, stringToMongooseId, log
};
