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
    if (typeof simpleID.counter == 'undefined') {
        simpleID.counter = 0;
    }
    return simpleID.counter++;
}

/**
 * combine two array into one
 * @param {any[]} arrA 
 * @param {any[]} arrB 
 */
function combine(arrA, arrB) {
    return arrA + arrB;
}

/**
 * check if token time already expired
 * @param {number} expires 
 * @returns 
 */
function isTokenExpired(expires) {
    return (Date.now() / 1000 - expires) >= 0;
}

const exported = { concat, combine, simpleID, isTokenExpired };

export default exported;