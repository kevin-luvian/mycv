const mongoose = require("mongoose");

/** 
 * convert to mongoose ObjectId or undefined if error
 * 
 * @param {string} str - string body
 * @return {mongoose.Types.ObjectId} splitted string
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
 * return value above minimum
 * @param {number} minVal 
 * @param {number} val 
 */
const min = (minVal, val) => val > minVal ? val : minVal;

/**
 * return value under maximum
 * @param {number} maxVal 
 * @param {number} val 
 */
const max = (maxVal, val) => val < maxVal ? val : maxVal;

/**
 * return value within the constraints
 * @param {number} minVal 
 * @param {number} maxVal 
 * @param {number} val 
 */
const constraint = (minVal, maxVal, val) => min(minVal, max(maxVal, val));

module.exports = {
    stringToList, stringToMongooseId, log,
    min, max, constraint
};
