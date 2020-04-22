var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var Article = require("../models/article");

// GET Add Article

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_article", {
    title: "Add Article",
  });
});

// POST Add Article

router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("category", "Category is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("add_article", {
      title: "Add Article",
      errors,
    });
  } else {
    const obj = JSON.parse(JSON.stringify(req.body));

    var article = new Article({
      title: obj.title,
      category: obj.category,
      date: new Date(),
      author: req.user.username,
      body: obj.body,
    });

    article.save((err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article added");
        res.redirect("/");
      }
    });
  }
});

// GET Get Article

router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("article", {
      title: article.title,
      article,
    });
  });
});

// GET Edit Article

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("edit_article", {
      title: "Edit Article",
      article,
    });
  });
});

// POST Edit Article

router.post("/edit/:id", (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  let article = {};

  article.title = obj.title;
  article.category = obj.category;
  article.date = new Date();
  article.author = obj.author;
  article.body = obj.body;

  let query = { _id: req.params.id };

  Article.update(query, article, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article updated");
      res.redirect("/");
    }
  });
});

// Delete Article

router.delete("/:id", (req, res) => {
  if (!req.user._id) res.status(500).send();
  Article.deleteOne({ _id: req.params.id }, (err) => {
    if (err) console.log(err);
    else res.send("Success");
  });
});

// Access Control

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("danger", "Please login in order to peform that action");
  res.redirect("/user/login");
}

module.exports = router;
