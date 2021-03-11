const none = 0;
const admin = 1;
const superadmin = 2;

const nonestring = "none";
const adminstring = "admin";
const superadminstring = "superadmin";

/** 
 * role string to number
 * 
 * @param {string} str - role as string
 * @return {number} role as number
 */
const stringToNum = str => {
    switch (str) {
        case adminstring:
            return admin;
        case superadminstring:
            return superadmin;
        default:
            return none;
    }
}

/** 
 * role number to string
 * 
 * @param {number} num - role as number
 * @return {string} role as string
 */
const numToString = num => {
    switch (num) {
        case admin:
            return adminstring;
        case superadmin:
            return superadminstring;
        default:
            return nonestring;
    }
}

/**
 * check if role has access with targetRole
 * return token object or null.
 * 
 * @param {Number} targetRole
 * @param {Number} role
 * @return {Boolean} access 
 */
const hasAccess = (targetRole, role) => {
    switch (targetRole) {
        case admin:
            return role === admin || role === superadmin;
        case superadmin:
            return role === superadmin;
        case none:
            return true;
        default:
            return false;
    }
}

module.exports = {
    none,
    admin,
    superadmin,
    stringToNum,
    numToString,
    hasAccess
};