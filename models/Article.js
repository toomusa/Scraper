const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true 
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note",
    properties: {
      admin: {
          type: Boolean,
          default: false
      },
      muted: {
          type: Boolean,
          default: false
      },
  }
  }]
});

const Article = mongoose.model("articles", ArticleSchema);

module.exports = Article;
