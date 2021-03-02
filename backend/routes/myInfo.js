const express = require('express');
const router = express.Router();
const resf = require("./responseFactory");
const MyInfoRepo = require('../repository/myInfoRepository');

const parseReqObject = req => {
    return {
        fullname: req.body.fullname === undefined ? "" : req.body.fullname,
        email: req.body.email === undefined ? "" : req.body.email,
        address: req.body.address === undefined ? "" : req.body.address,
        description: req.body.description === undefined ? "" : req.body.description,
        professions: req.body.professions === undefined ? [""] : req.body.professions,
        imageID: req.body.imageID === "0" ? undefined : req.body.imageID,
        cvID: req.body.cvID === "0" ? undefined : req.body.cvID
    };
}

router.post('/', (req, res) => {
    MyInfoRepo.save(parseReqObject(req));
    resf.r200(res, resf.message("MyInfo object saved"));
});

router.get('/', async (req, res) => {
    const data = await MyInfoRepo.retrieve();
    if (data != null)
        resf.r200(res, data);
    else
        resf.r404(res, "MyInfo object not found");
});

module.exports = router;