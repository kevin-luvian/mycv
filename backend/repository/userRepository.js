const mongoose = require("../bin/mongoose");
const User = require("../model/User");
const access = require("../model/Access");
const util = require("../util/utils");
const bcrypt = require("bcrypt");
const env = require("../util/envs");

const debug = util.log("debug:userRepository");

/**
 * find all User object
 *
 * @return {Object[]} Array of User object
 */
const retrieveLean = async () => {
  return await User.find().lean();
};

/**
 * find all User object
 *
 * @return {Promise<Object[]>} Array of User object
 */
const retrieve = async () => {
  let data = [];
  await User.find({}, (err, arr) => {
    if (err || arr.length == 0) debug("retrieve", err);
    else data = arr;
  });
  return data;
};

/**
 * delete User documents
 *
 * @return {Promise<Boolean>} success
 */
const purge = async () => {
  const res = await User.deleteMany(
    { role: { $ne: access.userRole.superadmin } },
    (err) => {
      if (err) debug("purge", err);
    }
  );
  return res.ok === 1;
};

/**
 * find User by id
 *
 * @param {mongoose.Types.ObjectId} id user document id
 * @return {Promise<Object>} User object or null
 */
const findById = (id) => {
  return User.findById(id, (err) => {
    if (err) debug("findById", err);
  });
};

/**
 * find User by username
 *
 * @param {string} str username
 * @return {Promise<Object>} User object or null
 */
const findByUsername = (str) => {
  return User.findOne({ username: str }, (err) => {
    if (err) debug("findByUsername", err);
  });
};

/**
 * create new User
 *
 * note:
 * - should not have _id attribute
 * - password should be raw string
 *
 * @param {Object} obj User Object
 * @return {Promise<Boolean>} success result
 */
const create = async (obj) => {
  obj.password = hashPass(obj.password);
  let success = true;
  await new User(obj).save().catch((err) => {
    debug("create", "saving user failed", err);
    success = false;
  });
  return success;
};

/**
 * hash password using bcrypt
 *
 * @param {string} pass raw password
 */
const hashPass = (pass) => {
  return bcrypt.hashSync(pass, parseInt(env.SALT_ROUNDS));
};

/**
 * remove password attribute from user array
 *
 * @param {Object[]} arr array of User
 * @return {Object[]} modified array
 */
const removePassword = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    delete arr[i]["password"];
  }
  return arr;
};

module.exports = {
  retrieveLean,
  retrieve,
  purge,
  findById,
  findByUsername,
  create,
  removePassword,
};
