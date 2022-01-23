const { cnord } = require("./utils");

require("dotenv").config(); // uses .env file

const environments = {
  USERNAME_APP: process.env.USERNAME_APP,
  PASSWORD_APP: process.env.PASSWORD_APP,
  PORT: process.env.PORT || "9000",
  MONGO_DB: process.env.MONGO_DB,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  CORS_URLS: String(cnord(process.env.CORS_URLS, "")).split(","),
  empt: process.env.CORS_URLS,
};

module.exports = environments;
