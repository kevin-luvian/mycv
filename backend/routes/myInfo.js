const express = require('express');
const router = express.Router();
const resf = require("./responseFactory");
const MyInfoRepo = require('../repository/myInfoRepository');
const tokenAuth = require("../middleware/tokenAuth");
const util = require("../util/utils");
const debug = util.log("routes:myinfo");

router.post('/', tokenAuth.admin, (req, res) => {
    MyInfoRepo.save(parseReqObject(req));
    resf.r200(res, "MyInfo object saved");
});

router.get('/', async (req, res) => {
    const data = await MyInfoRepo.retrieve();
    if (data) resf.r200(res, "MyInfo object found", data);
    else resf.r404(res, "MyInfo object not found");
});

router.delete('/', tokenAuth.admin, async (req, res) => {
    const success = await MyInfoRepo.purge();
    if (success) resf.r200(res, "MyInfo object deleted");
    else resf.r404(res, "MyInfo object deletion failed");
});

const parseReqObject = req => {
    return {
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        description: req.body.description,
        gender: MyInfoRepo.constraintGender(req.body.gender || 0),
        professions: util.stringToList(req.body.professions, ","),
        imageID: util.stringToMongooseId(req.body.imageID),
        cvID: util.stringToMongooseId(req.body.cvID)
    };
}

module.exports = router;
