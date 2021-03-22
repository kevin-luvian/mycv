const router = require("express").Router();
const resf = require("./responseFactory");
const tokenAuth = require("../middleware/tokenAuth");
const funInfoRepo = require("../repository/funInfoRepository");
const util = require("../util/utils");
const debug = util.log("routes:funinfo");

router.post('/', tokenAuth.admin, (req, res) => {
    const obj = parseReqObject(req);
    funInfoRepo.save(obj);
    resf.r200(res, "FunInfo object saved");
});

router.get('/', async (req, res) =>
    resf.r200(res, "FunInfos retrieved", await funInfoRepo.retrieve()));

router.get('/:type', async (req, res) => {
    let type = Number(req.params.type);
    if (isNaN(type)) type = -1;
    resf.r200(res, "FunInfos retrieved", await funInfoRepo.findByType(type));
});

router.delete('/:id', tokenAuth.admin, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    const deleted = await funInfoRepo.deleteById(id);
    if (deleted) resf.r200(res, "deletion successfull");
    else resf.r500(res, "deletion failed");
});

const parseReqObject = req => {
    return {
        title: req.body.title,
        description: req.body.description,
        favicon: req.body.favicon,
        type: funInfoRepo.constraintType(req.body.type || 0),
    };
}

module.exports = router;
