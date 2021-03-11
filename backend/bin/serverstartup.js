//const User = require("./models/User");
const bcrypt = require("bcrypt");
const debug = require("../util/utils").log("bin:serverstartup");

require("dotenv").config();

module.exports = () => {
  const username = process.env.USERNAME_APP;
  const password = process.env.PASSWORD_APP;
  debug("create_user", "username:", username, "password:", password );
};
