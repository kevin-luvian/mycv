/**
 * concatenate multiple string with whitespace
 * 
 * @param  {...string} strs string array 
 * @returns {string} concated string
 */
export function concat(...strs) {
    let res = "";
    for (let i = 0; i < strs.length; i++) {
        res += strs[i] + " ";
    }
    return res;
}

/**
 * static id counter
 * @returns {number} id
 */
export function simpleID() {
    if (typeof simpleID.counter == 'undefined') simpleID.counter = 0;
    return simpleID.counter++;
}

/**
 * generate random string using Math.random(). Combined with simpleID to guarantee uniqueness.
 * @returns {string} id
 */
export function badStringID() {
    return "_" + simpleID() + "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * generate ID then return function to concat string with the ID.
 */
export function memoizeID() {
    const id = "_" + simpleID();
    return (astr) => astr + id;
}

/**
 * check if token time already expired
 * @param {number} expires 
 * @returns {boolean}
 */
export function isTokenExpired(expires) {
    return (Date.now() / 1000 - expires) >= 0;
}

/**
 * convert array of string to string
 * @param {string[]} strArr 
 * @returns {string}
 */
export function arrayToString(strArr, separator = ",") {
    let res = strArr[0];
    for (let i = 1; i < strArr.length; i++) {
        res += separator + " " + strArr[i];
    }
    return res;
}

export function hasNumberOnly(str) {
    const regex = new RegExp("^[0-9]+$");
    return regex.test(str);
}

const exported = {
    concat,
    simpleID, badStringID, memoizeID,
    isTokenExpired,
    arrayToString,
    hasNumberOnly
};

export default exported;