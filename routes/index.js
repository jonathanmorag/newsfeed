var express = require("express");
var router = express.Router();
var fs = require("fs");

var Article = require("../models/article");

/* GET Home page. */
router.get("/", async (req, res, next) => {
  Article.find({}, async (err, articles) => {
    if (err) console.log(err);
    else {
      fs.readFile("./categories.txt", (err, data) => {
        if (err) throw err;
        var categories = data.toString().split("\n");
        res.render("index", { title: "News Feed", articles, categories });
      });
    }
  });
});

// Filter by day

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
        let user = req.user;
        res.render("index", { title: "News Feed", articles, user });
      }
    });
  }
});

// Filter by category

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
        let user = req.user;
        res.render("index", { title: "News Feed", articles, user });
      }
    });
  }
});

// GET Add Category

router.get("/add_category", (req, res, next) => {
  let user = req.user;
  res.render("add_category", { title: "Add Category", user });
});

// POST Add Category

router.post("/add_category", async (req, res, next) => {
  Article.find({}, async (err, articles) => {
    if (err) console.log(err);
    else {
      var category = req.body.category;
      fs.appendFile("./categories.txt", "\n" + category, (err) => {
        if (err) throw err;
        var categories = fs
          .readFileSync("./categories.txt")
          .toString()
          .split("\n");
        let user = req.user;
        res.render("index", { title: "News Feed", articles, user, categories });
      });
    }
  });
});

module.exports = router;
