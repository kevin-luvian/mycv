const router = require('express').Router();
const resf = require("./responseFactory");

router.all('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

module.exports = router;
