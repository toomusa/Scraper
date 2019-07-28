const express = require("express");
const router = express.Router();
const models = require("../models/").models;

router.route("/").get(models.homePage);
router.route("/saved").get(models.savedArticles);
router.route("/scrape").get(models.scrapeArticles);

router.route("/save").post(models.saveArticle);
router.route("/addnote").post(models.addNote);
router.route("/checknote").post(models.checkNote);
router.route("/remove").post(models.removeArticle);

module.exports = router;