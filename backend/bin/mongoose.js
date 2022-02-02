var mongoose = require("mongoose");
const env = require("../util/envs");
mongoose.main_conn = mongoose.createConnection(env.MONGO_DB, {
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.file_conn = mongoose.createConnection(env.MONGO_DB_FILE, {
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
module.exports = mongoose;
