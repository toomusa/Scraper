const Article = require("./Article")
const Note = require("./Note")
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

const models = {
    homePage: (req, res) => {
        res.render("index")
    },
    savedArticles: (req, res) => {
        res.render("saved")
    },
    showArticles: async (req, res) => {
        try {
            let articles = await Article.find();
            res.render("index", {articles})
        } catch(e) {
            console.log(e)
        }
    },
    scrapeArticles: (req, res) => {

        let articles = [];

        axios.get("https://news.berkeley.edu/category/campuscommunity/events_at_berkeley/").then(function(response) {
            
            let $ = cheerio.load(response.data)
            let idMaker = 1;
        
            $("article").each(function(index, element) {

                let result = {};

                result.title = $(this).find("h3").text().replace("\n", " ").trim();
                result.summary = $(this).find("img").attr("alt");
                result.photo = $(this).find("img").attr("src");
                result.link = $(this).find("a").attr("href");
                result.id = idMaker;

                articles.push(result)
                idMaker++;
            })
        }).then(() => {
            res.render("index", {articles})
        })
    },
    saveArticle: (req, res) => {

        let result = {};

        result.title = req.body.title;
        result.summary = req.body.summary;
        result.photo = req.body.photo;
        result.link = req.body.link;
        result.domId = req.body.id;
        
        Article.create(result)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err))
    
        res.send(result.domId);
    }
};

module.exports = {models, Article, Note};