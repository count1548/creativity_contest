const router = require("express").Router();
const db = require("./db");

router.use("/db", db);

module.exports = router;
