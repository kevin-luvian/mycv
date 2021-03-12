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
 * @returns 
 */
export function isTokenExpired(expires) {
    return (Date.now() / 1000 - expires) >= 0;
}

const exported = { concat, simpleID, badStringID, memoizeID, isTokenExpired };

export default exported;