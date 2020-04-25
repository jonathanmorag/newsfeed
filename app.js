var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var favicon = require("serve-favicon");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var session = require("express-session");
var connectFlash = require("connect-flash");
var expressMessages = require("express-messages");
var expressValidator = require("express-validator");
var passport = require("passport");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/userRoutes");
var articleRouter = require("./routes/articleRoutes");

var app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log("DB Connection Successful"))
  .catch((error) => console.log(error));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(favicon(__dirname + "/public/images/news.png"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

require("./assets/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/article", articleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
