const router = require("express").Router();
const resf = require("./responseFactory");
const tokenAuth = require("../middleware/tokenAuth");
const resumeRepo = require("../repository/resumeRepository");
const util = require("../util/utils");
const debug = util.log("routes:resume");

router.post('/', tokenAuth.admin, (req, res) => {
    const obj = parseResume(req);
    resumeRepo.save(obj);
    resf.r200(res, "Resume object saved");
});

router.get('/', async (req, res) =>
    resf.r200(res, "Resume retrieved", await resumeRepo.findAll()));

router.get('/:id', async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    const resume = await resumeRepo.findById(id);
    if (resume) resf.r200(res, "object retrieved", resume);
    else resf.r400(res, "object not found");
});

// router.get('/:type', async (req, res) => {
//     let type = Number(req.params.type);
//     if (isNaN(type)) type = -1;
//     resf.r200(res, "FunInfos retrieved", await funInfoRepo.findByType(type));
// });

router.put('/:id', tokenAuth.admin, async (req, res) => {
    let obj = parseResume(req);
    obj["_id"] = util.stringToMongooseId(req.params.id);
    const updated = await resumeRepo.update(obj);
    if (updated.ok) resf.r200(res, "update successfull");
    else resf.r500(res, "update failed");
});

router.delete('/:id', tokenAuth.admin, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    const deleted = await resumeRepo.deleteById(id);
    if (deleted.ok) resf.r200(res, "delete successfull");
    else resf.r500(res, "delete failed");
});

const parseResume = req => {
    return {
        title: req.body.title,
        place: req.body.place,
        date: req.body.date,
        description: req.body.description,
        category: req.body.category,
    };
}

const parseSkill = req => {
    return {
        title: req.body.title,
        level: req.body.level,
        category: req.body.category,
    };
}

module.exports = router;
