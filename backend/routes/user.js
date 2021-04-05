const express = require("express");
const router = express.Router();
const tokenAuth = require("../middleware/tokenAuth");
const resf = require("./responseFactory");
const util = require("../util/utils");
const userRepo = require("../repository/userRepository");
const access = require("../model/Access");
const debug = util.log("routes:user");

router.get("/", tokenAuth.admin, async (req, res) => {
    const users = userRepo.removePassword(await userRepo.retrieveLean());
    resf.r200(res, "users found", users);
});

router.get("/:id", async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    debug("GET", "id:", id);

    if (id !== null) {
        const obj = await userRepo.findById(id);
        if (obj !== null) return resf.r200(res, "user found", obj);
    }

    resf.r404(res, "User object not found");
});

router.post("/", async (req, res) => {
    const obj = parseReqObject(req);
    debug("POST", "user obj", obj);
    const isCreated = await userRepo.create(obj);
    if (isCreated)
        resf.r200(res, "User object is saved");
    else
        resf.r404(res, "User object failed to create");
});

router.delete("/all", tokenAuth.superadmin, async (req, res) => {
    const purged = await userRepo.purge();
    if (purged) resf.r200(res, "All User document successfully deleted");
    else resf.r404(res, "User deletion failed");
});

router.delete("/:id", async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    resf.r404(res, "User object not found");
});

const parseReqObject = (req) => {
    let role = req.body.role || 0;
    if (role && typeof role === "string") role = access.getValueFromStr(access.userRole, role);

    return {
        username: req.body.username || "",
        password: req.body.password || "",
        role: role,
    };
};

module.exports = router;
