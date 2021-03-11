const none = 0;
const admin = 1;
const superadmin = 2;

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
    hasAccess
};