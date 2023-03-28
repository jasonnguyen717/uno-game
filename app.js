var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sessionInstance = require("./app-config/session");
const protect = require("./app-config/protect");
const helpers = require("./components/hbsHelpers");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

// var handlebars = require('express-handlebars');
var indexRouter = require("./routes/pages/index");
var gamesRouter = require("./routes/pages/games");
var lobbyRouter = require("./routes/pages/lobby");
var testsRouter = require("./routes/pages/tests");
var authRouter = require("./routes/pages/auth");
var chatRouter = require("./routes/api/chat");
var hbs = require("hbs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
app.set("view options", { layout: "public/landing" });

// hbs helper function
for (let helper in helpers) {
  hbs.registerHelper(helper, helpers[helper]);
  /*   hbs.registerHelper("numPlayers", function (p, q, options) {
    return p == q ? options.fn(this) : options.inverse(this);
  }); */
}

// app.engine('hbs', handlebars({
//   layoutsDir:  path.join(__dirname, 'views/layouts'),
//   partialsDir: path.join(__dirname, 'views/partials'),
//   extname: 'hbs',
//   defaultLayout: 'layout'
// }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionInstance);

app.use("/", indexRouter);
app.use("/games", protect, gamesRouter);
app.use("/lobby", protect, lobbyRouter);
app.use("/tests", testsRouter);
app.use("/auth", authRouter);
app.use("/chat", protect, chatRouter);

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
