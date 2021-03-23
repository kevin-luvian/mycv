const defaultType = 0;
const visibilityTypes = {
    0: "public",
    1: "private",
    2: "hidden"
}

/**
 * @param {string} str 
 * @returns {number}
 */
const stringToTypeNum = str => {
    if (!str || str.length > 0) return defaultType;
    const key = Object.keys(visibilityTypes).find(key => visibilityTypes[key] === str);
    return Number(key || defaultType);
}

/**
 * @param {number} num 
 * @returns {string}
 */
const numToTypeStr = num => {
    const key = Object.keys(visibilityTypes).find(key => Number(key) === num);
    return visibilityTypes[key || defaultType];
}

/**
 * check if num in visibility type
 * @param {number} num 
 * @returns {number}
 */
const sanitizeTypeNum = num => {
    if (!visibilityTypes[num]) return defaultType;
    return num;
}

module.exports = { defaultType, sanitizeTypeNum, stringToTypeNum, numToTypeStr }