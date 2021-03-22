const jwt = require("jsonwebtoken");
const resf = require("../routes/responseFactory");
const UserRepo = require("../repository/userRepository");
const UserRole = require("../model/UserRole");
require("dotenv").config();


const debug = require("../util/utils").log("middleware:tokenAuth");

// Utility functions
const setLocalsToken = (res, token) => { res.locals.token = token; };
const getLocalsToken = (res) => res.locals.token;
const convertToken = ({ username }) => { return { username }; }

// main validation functions
const validateToken = (req, res) => {
    const authorizationHeader = req.header("Authorization");
    try {
        const token = jwt.verify(authorizationHeader, process.env.JWT_TOKEN_SECRET);
        return convertToken(token);
    } catch (err) {
        debug("validateToken", "\ntoken:", authorizationHeader, "\nmessage:", err.message);
        return null;
    }
}
const validateRole = async (req, res, next, role) => {
    const token = validateToken(req, res);
    if (!token) return resf.r401(res, "invalid token");

    const user = await UserRepo.findByUsername(token.username);
    if (!user) return resf.r401(res, "user not found");

    if (UserRole.hasAccess(role, user.role)) next();
    else resf.r401(res, "unauthorized");
}

// role adapters
const admin = (req, res, next) => validateRole(req, res, next, UserRole.admin);
const superadmin = (req, res, next) => validateRole(req, res, next, UserRole.superadmin);
const valid = (req, res, next) => {
    const token = validateToken(req, res);
    if (token) next();
    else resf.r401(res, "invalid token");
}

module.exports = {
    valid, admin, superadmin,
    setLocalsToken, getLocalsToken
};