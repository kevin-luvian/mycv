const router = require('express').Router();
const resf = require("./responseFactory");

router.get('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

router.post('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

router.delete('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

router.put('/', (req, res) => {
  resf.r404(res, "endpoint not found");
});

module.exports = router;
