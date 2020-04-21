var express = require("express");
var router = express.Router();

var Article = require("../models/article");

/* GET home page. */
router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) console.log(err);
    else res.render("index", { title: "News Feed", articles });
  });
});

router.post("/", (req, res, next) => {
  var day = req.body.filter;
  if (!day) res.redirect("/");
  else {
    Article.find({}, (err, articles) => {
      if (err) console.log(err);
      else {
        articles = articles.filter(
          (a) => a.date.toDateString().split(" ")[0] == day
        );
        res.render("index", { title: "News Feed", articles });
      }
    });
  }
});

module.exports = router;
