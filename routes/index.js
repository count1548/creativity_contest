var express = require("express");
var router = express.Router();
var dbRouter = require("./api/db/index");

router.use("./db", dbRouter);

module.exports = router;
