const mongoose = require("mongoose");

/** 
 * convert to mongoose ObjectId or undefined if error
 * 
 * @param {string} str - string body
 * @return {mongoose.Types.ObjectId|undefined} splitted string
 */
const stringToMongooseId = str => {
    try {
        if (!str) throw ("error");
        return mongoose.Types.ObjectId(str);
    } catch (e) {
        return undefined;
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
    if (!str || 0 === str.length) return [""];
    const strList = str.split(separator);
    strList.forEach((s, i, arr) => { arr[i] = s.trim(); });
    return strList;
}

/**
 * log with leading debug string
 * 
 * @param {string} rootTag 
 * @return {(tag:string, ...args)=>void} logging function
 */
const log = rootTag => (tag, ...args) => { console.log(`[ ${rootTag}:${tag} ]`, ...args); }

/**
 * return value within the constraints
 * @param {number} minVal 
 * @param {number} maxVal 
 * @param {number} val 
 */
const constraint = (minVal, maxVal, val) => Math.max(minVal, Math.min(maxVal, val));

/**
 * copy elements property in documents
 * @param {any[]} arr 
 * @return {any[]}
 */
const leanDocsCopy = arr => arr.map(val => Object.assign({}, val._doc));

module.exports = {
    log,
    constraint,
    stringToList,
    leanDocsCopy,
    stringToMongooseId,
};
