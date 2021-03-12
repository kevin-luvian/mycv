/**
 * concatenate multiple string with whitespace
 * 
 * @param  {...string} strs string array 
 * @returns {string} concated string
 */
function concat(...strs) {
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
function simpleID() {
    if (typeof simpleID.counter == 'undefined') simpleID.counter = 0;
    return simpleID.counter++;
}

/**
 * generate ID then return function to concat string with the ID.
 */
function memoizeID() {
    const id = "_" + simpleID();
    return (astr) => astr + id;
}

/**
 * check if token time already expired
 * @param {number} expires 
 * @returns 
 */
function isTokenExpired(expires) {
    return (Date.now() / 1000 - expires) >= 0;
}

const exported = { concat, simpleID, memoizeID, isTokenExpired };

export default exported;