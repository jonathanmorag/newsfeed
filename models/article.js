const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: Date,
  author: {
    type: String,
    required: true,
  },
  image: String,
  body: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Article", articleSchema);
