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
  var day = req.body.selectname;
  if (!day || day == "all") {
    res.redirect("/");
  } else {
    day = day.substring(0, 3);
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

router.post("/category", (req, res, next) => {
  var category = req.body.selectname;
  console.log(req.body);
  if (!category || category == "all") {
    res.redirect("/");
  } else {
    Article.find({}, (err, articles) => {
      if (err) console.log(err);
      else {
        articles = articles.filter((a) => a.category == category);
        res.render("index", { title: "News Feed", articles });
      }
    });
  }
});

module.exports = router;
