const router = require("express").Router();
const dirRepo = require("../repository/directoryRepository");
const userRepo = require("../repository/userRepository");
const access = require("../model/Access");
const tokenAuth = require("../middleware/tokenAuth");
const resf = require("./responseFactory");
const util = require("../util/utils");
const debug = util.log("routes:directory");

router.get('/', tokenAuth.parseTokenUser, async (req, res) => {
    const user = tokenAuth.getLocalsUser(res);
    const uRole = user ? user.role : -1;
    resf.r200(res, "directories found", await dirRepo.retrieveRestrictedByRole(uRole));
});

router.get('/root', async (req, res) =>
    resf.r200(res, "root directories found", await dirRepo.findRoots()));

router.get('/everything', async (req, res) =>
    resf.r200(res, "directories found", await dirRepo.findAll()));

router.get('/:id', tokenAuth.parseTokenUser, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    if (!id) return resf.r400(res, "id is not valid");

    const user = tokenAuth.getLocalsUser(res);
    const role = user ? user.role : -1;

    let dir = await dirRepo.findFullById(id);
    if (!dir) return resf.r404(res, "directories not found");

    if (access.visibilityAccess(role, dir.type))
        resf.r200(res, "directories found", dirRepo.restrictByRole(role, dir));
    else
        resf.r401(res, "not authorized");
});

router.post('/', tokenAuth.admin, async (req, res) => {
    const data = parseDirObject(req.body);
    if (await dirRepo.save(data))
        resf.r200(res, "directory saved");
    else
        resf.r500(res, "saving failed");
});

router.put('/:id', tokenAuth.admin, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    if (!id) return resf.r400(res, "id is not valid");
    const data = parseDirObject(req.body);
    data._id = id;
    await dirRepo.update(data);
    resf.r200(res, "directory updated");
});

router.delete('/purge', tokenAuth.admin, async (req, res) => {
    const purged = await dirRepo.purge();
    if (purged) resf.r200(res, "all directory deleted");
    else resf.r500(res, "deletion failed");
});

router.delete('/:id', tokenAuth.admin, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    await dirRepo.deleteRootByID(id);
    resf.r200(res, "Directory deleted");
});

const parseDirObject = ({ _id, title, content, order, type, images, childrens }) => {
    if (typeof type !== "number") type = access.getValueFromStr(access.visibilityType, type);
    return {
        _id: _id || "",
        title: title || "none",
        content,
        order,
        type,
        images: images || [],
        childrens: childrens || []
    };
}

module.exports = router;