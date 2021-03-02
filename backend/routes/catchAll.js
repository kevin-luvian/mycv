const express = require('express');
const router = express.Router();
const resf = require("./responseFactory");

router.get('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

module.exports = router;
