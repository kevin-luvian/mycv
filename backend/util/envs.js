const { cnord } = require("./utils");

require("dotenv").config(); // uses .env file

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  USERNAME_APP: process.env.USERNAME_APP,
  PASSWORD_APP: process.env.PASSWORD_APP,
  PORT: cnord(process.env.PORT, "9000"),
  MONGO_DB: process.env.MONGO_DB,
  MONGO_DB_FILE: process.env.MONGO_DB_FILE,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  CORS_URLS: String(cnord(process.env.CORS_URLS, "")).split(","),
  METRICS_USERNAME: process.env.METRICS_USERNAME,
  METRICS_PASSWORD: process.env.METRICS_PASSWORD,
};

module.exports = environments;
