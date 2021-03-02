//const User = require("./models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();

module.exports = () => {
  const username = process.env.USERNAME_APP;
  const password = process.env.PASSWORD_APP;
  console.log("[server-startup] username:", username, "password:", password);
};
