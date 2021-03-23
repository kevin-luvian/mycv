const router = require("express").Router();
const dirRepo = require("../repository/directoryRepository");
const tokenAuth = require("../middleware/tokenAuth");
const Visibility = require("../model/Visiblity");
const resf = require("./responseFactory");
const util = require("../util/utils");
const debug = util.log("routes:directory");

router.get('/', async (req, res) => resf.r200(res, "directories found", await dirRepo.retrieve()));

router.post('/', tokenAuth.admin, async (req, res) => {
    const data = parseDirObject(req.body);
    const saved = await dirRepo.save(data);
    if (saved) resf.r200(res, "directory saved");
    else resf.r500(res, "saving failed");
});

router.get('/:type', async (req, res) => {
});

router.put('/:id', tokenAuth.admin, async (req, res) => {
});

router.delete('/purge', tokenAuth.admin, async (req, res) => {
    const purged = await dirRepo.purge();
    if (purged) resf.r200(res, "all directory deleted");
    else resf.r500(res, "deletion failed");
});

router.delete('/:id', tokenAuth.admin, async (req, res) => {
});

const parseDirObject = ({ title, content, order, type, images, childrens }) => {
    if (typeof type !== "number") type = Visibility.stringToTypeNum(type);
    return {
        title: title || "none",
        content,
        order,
        type,
        images: images || [],
        childrens: childrens || []
    };
}

module.exports = router;
