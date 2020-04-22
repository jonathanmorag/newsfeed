var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");

var User = require("../models/user");

// Register Form

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", (req, res, done) => {
  const username = req.body.username;
  const password = req.body.password;

  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();

  var errors = req.validationErrors();

  User.findOne({ username }, (err, user) => {
    if (user) {
      var e = {
        param: "username",
        msg: "Username already exists",
        value: req.body.username,
      };
      if (!errors) errors = [];
      errors.push(e);
      res.render("register", { title: "Register", errors });
    } else {
      if (errors) {
        res.render("register", { title: "Register", errors });
      } else {
        let newUser = new User({
          username,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash;
            newUser.save((err) => {
              if (err) {
                console.log(err);
                return;
              }
              req.flash("success", "Registered successfully!");
              res.redirect("/");
            });
          });
        });
      }
    }
  });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
