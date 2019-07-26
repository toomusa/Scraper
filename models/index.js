const Article = require("./Article")
const Note = require("./Note")
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

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
                result.domId = idMaker;

                articles.push(result)
                idMaker++;
            })
        }).then(() => {
            res.render("index", {articles})
        }).catch(e => console.log(e))
    },
    saveArticle: (req, res) => {

        let result = {};

        result.title = req.body.title;
        result.summary = req.body.summary;
        result.photo = req.body.photo;
        result.link = req.body.link;
        result.domId = req.body.domId;
        
        Article.create(result)
            .then(dbArticle => console.log("yes"))
            .catch(err => console.log(err))
    
        res.send(result.domId);
    },
    addNote: async (req, res) => {

        // let result = {};
        // result.title = req.body.title;
        // result.summary = req.body.summary;
        // result.photo = req.body.photo;
        // result.link = req.body.link;
        // result.domId = req.body.domId;
        
        let note = {};
        let articleTitle = req.body.title;
        
        note.title = req.body.noteTitle;
        note.body = req.body.note;
        note.domId = req.body.domId;

        let newNote = await Note.create(note);
        await Article.findOneAndUpdate({title: articleTitle}, {$push: {note: newNote._id}}, {new: true})
        res.send(note.domId);
    },
    checkNote: async (req, res) => {
        console.log(req.body)
        let articlePhoto = req.body.photo;
        let articleTitle = req.body.title;
        let noteId = req.body.noteId;
        console.log("ARTICLE TITLE: " + articleTitle)

        // let dbArticle = await Article.findOne({photo: articlePhoto})
        // console.log(dbArticle)
        // res.send(dbArticle);

        let dbArticle = await Article.findOne({ photo: articlePhoto }).populate("note")
        console.log(dbArticle)
        res.send(dbArticle);

    }
};

module.exports = {models, Article, Note};