const Article = require("./Article")
const Note = require("./Note")
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const models = {
    homePage: async (req, res) => {
        try {
            let articles = await Article.find().populate("note");
            res.render("index", {articles})
        } catch(e) {
            console.log(e)
        }
    },
    savedArticles: async (req, res) => {
        try {
            let articles = await Article.find({saved: true});
            res.render("index", {articles})
        } catch(e) {
            console.log(e)
        }
    },
    scrapeArticles: async (req, res) => {
        let articles = [];

        let scrapedContent = await axios.get("https://news.berkeley.edu/category/campuscommunity/events_at_berkeley/")
        let $ = cheerio.load(scrapedContent.data)
    
        $("article").each( (index, element) => {
            let result = {};
            result.title = $(element).find("h3").text().replace("\n", " ").trim();
            result.summary = $(element).find("img").attr("alt");
            result.photo = $(element).find("img").attr("src");
            result.link = $(element).find("a").attr("href");
            result.saved = false;
            articles.push(result)
        })

        const merge = (a, b, p) => a.filter( aa => ! b.find ( bb => aa[p] === bb[p]) ).concat(b);
        let articlesInDb = await Article.find();
        let articlesToUpdate = merge(articles, articlesInDb, "saved");
        
        let updatedArticles = await Article.updateMany(articlesToUpdate);
        let savedArticles = await Article.find();
        if (savedArticles.length === articlesToUpdate.length) {
                res.redirect("/");
            }

        // Use to set up DB after dropping collection
            // let writtenArticles = await Article.insertMany(articles)
            // if (writtenArticles.length === articles.length) {
            //     res.redirect("/");
            // }
    },
    saveArticle: async (req, res) => {
        let { _id } = req.body;
        let savedArticle = await Article.findByIdAndUpdate(_id, {saved: true});
        res.send(savedArticle);
    },
    removeArticle: async (req, res) => {
        let { _id } = req.body
        let articleToRemove = await Article.findByIdAndUpdate(_id, {saved: false});
         
        if (articleToRemove.note && articleToRemove.note._id) {
            let noteId = articleToRemove.note._id;
            let removedNote = await Note.findByIdAndRemove(noteId);
        }

        let removedArticle = await Article.findById(_id);
        res.send(removedArticle);
    },
    addNote: async (req, res) => {
        let _id = req.body._id;
        let noteId = req.body.noteId;
        let note = {};
        note.title = req.body.noteTitle;
        note.body = req.body.noteBody;

        if (noteId === "") {
            let newNote = await Note.create(note);
            let articleWithNote = await Article.findByIdAndUpdate(_id, {$push: {note: newNote._id}}, {new: true})
            res.send(articleWithNote);
        } else {
            let updateNote = await Note.replaceOne({_id: noteId}, note, {upsert: true});
            let articleWithNote = await Article.findById(_id).populate("note")
            res.send(articleWithNote);
        }
    },
    checkNote: async (req, res) => {
        let _id = req.body._id;
        let savedNote = await Article.findById(_id).populate("note")
        res.send(savedNote);
    }
};

module.exports = {models, Article, Note};