const express = require("express");
const router = express.Router();
const tokenAuth = require("../middleware/tokenAuth");
const resf = require("../routes/responseFactory");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const debug = require("../util/utils").log("routes:authentication");
const userRepo = require("../repository/userRepository");

const parseReqObject = req => {
    return {
        username: req.body.username || "",
        password: req.body.password || ""
    };
}

router.get("/check", tokenAuth.valid, async (req, res) => {
    resf.r200(res, "authenticated", tokenAuth.getLocalsToken(res));
});

router.post("/", async (req, res) => {
    const rObj = parseReqObject(req);
    const user = await userRepo.findByUsername(rObj.username);

    // user exist
    if (user != null)
        // password match
        if (bcrypt.compareSync(rObj.password, user.password))
            return resf.r200(res, "authenticated", createToken(user.username));
    debug("POST", "authentication failed", "\nrObj:", rObj, "\nuser:", user);
    resf.r404(res, "authentication failed");
});

/** 
 * create token with username, expires in 2 hour
 * 
 * @param {string} username username
 */
const createToken = username => {
    const time = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const token = jwt.sign({ username: username, exp: time }, process.env.JWT_TOKEN_SECRET);
    return {
        username: username,
        token: token,
        expires: time
    }
}

module.exports = router;