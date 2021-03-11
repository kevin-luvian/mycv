const express = require('express');
const router = express.Router();
const resf = require("./responseFactory");
const MyInfoRepo = require('../repository/myInfoRepository');
const util = require("../util/utils");

router.post('/', (req, res) => {
    MyInfoRepo.save(parseReqObject(req));
    resf.r200(res, "MyInfo object saved");
});

router.get('/', async (req, res) => {
    const data = await MyInfoRepo.retrieve();
    if (data) resf.r200(res, "MyInfo object found", data);
    else resf.r404(res, "MyInfo object not found");
});

const parseReqObject = req => {
    return {
        fullname: req.body.fullname || "",
        email: req.body.email || "",
        address: req.body.address || "",
        description: req.body.description || "",
        professions: util.stringToList(req.body.professions, ","),
        imageID: "0" === req.body.imageID ? undefined : req.body.imageID,
        cvID: "0" === req.body.cvID ? undefined : req.body.cvID
    };
}

module.exports = router;