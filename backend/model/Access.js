const userRole = {
    none: 0,
    admin: 1,
    superadmin: 2,
    default: 0,
}

const visibilityType = {
    public: 0,
    private: 1,
    hidden: 2,
    default: 0,
}

/**
 * check if role has access with targetRole
 * @param {Number} targetRole
 * @param {Number} role
 * @return {Boolean} access 
 */
const roleAccess = (targetRole, role) => {
    switch (targetRole) {
        case userRole.admin:
            return role === userRole.admin
                || role === userRole.superadmin;
        case userRole.superadmin:
            return role === userRole.superadmin;
        case userRole.none:
            return true;
        default:
            return false;
    }
}

/**
 * check if role has access with type
 * 
 * @param {Number} targetType
 * @param {Number} role
 * @return {Boolean} access 
 */
const visibilityAccess = (role, targetType) => {
    switch (targetType) {
        case visibilityType.hidden:
            return role === userRole.admin
                || role === userRole.superadmin;
        case visibilityType.private:
            return role === userRole.none
                || role === userRole.admin
                || role === userRole.superadmin;
        case visibilityType.public:
            return true;
        default:
            return false;
    }
}

/**
 * get dictionary value or default
 * @param {any} adict 
 * @param {string} astr 
 * @returns {any}
 */
const getValueFromStr = (adict, astr) => {
    const value = adict[astr]
    if (!value) return adict.default;
    return value
}

const getKeyFromValue = (adict, anum) => {
    const key = Object.keys(adict).find(key => adict[key] === anum);
    if (!key) return "none";
    return key;
}

const containsValue = (adict, anum) => {
    const key = Object.keys(adict).find(key => adict[key] === anum);
    if (!key) return adict.default;
    return adict[key];
}

module.exports = {
    userRole,
    visibilityType,
    roleAccess,
    visibilityAccess,
    getValueFromStr,
    getKeyFromValue,
    containsValue
};