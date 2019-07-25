const express = require("express");
const router = express.Router();
const models = require("../models/").models;

router.route("/").get(models.homePage);
router.route("/saved").get(models.showArticles);
router.route("/scrape").get(models.scrapeArticles);

router.route("/save").post(models.saveArticle);

module.exports = router;