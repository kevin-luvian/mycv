const jwt = require("jsonwebtoken");
const resf = require("../routes/responseFactory");
const userRepo = require("../repository/userRepository");
const access = require("../model/Access");
const env = require("../util/envs");
require("dotenv").config();

const debug = require("../util/utils").log("middleware:tokenAuth");

// Utility functions
const setLocalsToken = (res, token) => {
  res.locals.token = token;
};
const getLocalsToken = (res) => res.locals.token;
const convertToken = ({ username }) => {
  return { username };
};

const setLocalsUser = (res, user) => {
  res.locals.user = user;
};
const getLocalsUser = (res) => res.locals.user;

// main validation functions
const validateToken = (req) => {
  const authorizationHeader = req.header("Authorization");
  try {
    const token = jwt.verify(authorizationHeader, env.JWT_TOKEN_SECRET);
    return convertToken(token);
  } catch (err) {
    debug(
      "validateToken",
      "\ntoken:",
      authorizationHeader,
      "\nmessage:",
      err.message
    );
    return null;
  }
};
const validateRole = async (req, res, next, role) => {
  const token = validateToken(req);
  if (!token) return resf.r401(res, "invalid token");

  const user = await userRepo.findByUsername(token.username);
  if (!user) return resf.r401(res, "user not found");

  if (access.roleAccess(role, user.role)) next();
  else resf.r401(res, "unauthorized");
};

// role adapters
const admin = (req, res, next) =>
  validateRole(req, res, next, access.userRole.admin);
const superadmin = (req, res, next) =>
  validateRole(req, res, next, access.userRole.superadmin);
const valid = (req, res, next) => {
  const token = validateToken(req);
  if (token) next();
  else resf.r401(res, "invalid token");
};

const parseTokenUser = async (req, res, next) => {
  const token = validateToken(req);
  const username = token ? token.username : null;
  const user = await userRepo.findByUsername(username);
  setLocalsUser(res, user);
  next();
};

module.exports = {
  valid,
  admin,
  superadmin,
  parseTokenUser,
  setLocalsToken,
  getLocalsToken,
  getLocalsUser,
};
