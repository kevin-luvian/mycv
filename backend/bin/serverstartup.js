const userRepo = require("../repository/userRepository");
const access = require("../model/Access");
const debug = require("../util/utils").log("bin:serverstartup");

require("dotenv").config();

const createUserObject = (username, password, role) => { return { username, password, role }; };

const defaultSuperuser = async () => {
  const username = process.env.USERNAME_APP;
  const password = process.env.PASSWORD_APP;

  const user = await userRepo.findByUsername(username);
  if (!user) {
    const newUser = createUserObject(username, password, access.userRole.superadmin);
    await userRepo.create(newUser);
    debug("defaultSuperuser", "new superuser created", "username:", username, "password:", password);
  }
};

module.exports = defaultSuperuser;