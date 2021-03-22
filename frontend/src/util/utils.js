/**
 * check if value includes one of the target
 * @param {string} value 
 * @param  {...string} targets 
 * @returns {boolean}
 */
export function orIncludes(value, ...targets) {
    if (!value) return false;
    let result = value.includes(targets[0]);
    for (let i = 1; i < targets.length; i++) {
        result = result || value.includes(targets[i]);
    }
    return result;
}

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

/**
 * check if string only has number
 * @param {string} str 
 * @returns {boolean}
 */
export function hasNumberOnly(str) {
    const regex = new RegExp("^[0-9]+$");
    return regex.test(str);
}

/**
 * check if stringA has substring stringB
 * @param {string} strA 
 * @param {string} strB 
 * @returns {boolean}
 */
export function containStr(strA, strB) {
    return strA.toLowerCase().includes(strB.toLowerCase());
}

/**
 * constraint number to minimum and maximum value
 * @param {number} num 
 * @param {number} minVal 
 * @param {number} maxVal 
 * @returns {number}
 */
export function constraint(num, minVal, maxVal) {
    return num < minVal ? minVal : (num > maxVal ? maxVal : num);
}

/**
 * convert number with leading zero
 * @param {number} num 
 * @param {string} size 
 * @returns {string}
 */
export function pad(num, size) {
    let numStr = num.toString();
    while (numStr.length < size)
        numStr = "0" + numStr;
    return numStr;
}