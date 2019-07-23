const express = require("express");
const router = express.Router();
const models = require("../models/");

router.route("/").get(models.homePage);

module.exports = router;