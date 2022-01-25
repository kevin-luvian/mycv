const router = require("express").Router();
const resf = require("./responseFactory");
const tokenAuth = require("../middleware/tokenAuth");
const contactRepo = require("../repository/contactRepository");
const util = require("../util/utils");
const debug = util.log("routes:contact");

router.post('/', tokenAuth.admin, (req, res) => {
    const obj = parseContact(req);
    contactRepo.save(obj);
    resf.r200(res, "contact object saved");
});

router.get('/', async (req, res) =>
    resf.r200(res, "contact retrieved", await contactRepo.findAll()));

router.get('/:id', async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    const contact = await contactRepo.findById(id);
    if (contact) resf.r200(res, "object retrieved", contact);
    else resf.r400(res, "object not found");
});

router.put('/:id', tokenAuth.admin, async (req, res) => {
    let obj = parseContact(req);
    obj["_id"] = util.stringToMongooseId(req.params.id);
    const updated = await contactRepo.update(obj);
    if (updated.ok) resf.r200(res, "update successfull");
    else resf.r500(res, "update failed");
});

router.delete('/:id', tokenAuth.admin, async (req, res) => {
    const id = util.stringToMongooseId(req.params.id);
    const deleted = await contactRepo.deleteById(id);
    if (deleted.ok) resf.r200(res, "delete successfull");
    else resf.r500(res, "delete failed");
});

const parseContact = req => {
    return {
        title: req.body.title,
        icon: req.body.icon,
        description: req.body.description,
    };
}

module.exports = router;
