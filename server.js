/*
  Author: Hoang Long Le
  29 September 2022
  Student ID 301236235
*/

const express = require('express');
const mongoose = require('mongoose');
const route = require('./server/routes/index');
const app = express();
const path = require('path');
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
var http = require('http');

let usersRouter = require("./server/routes/users");

// Authentication modules
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require("connect-flash");

// register view engine
app.set("views", path.join(__dirname, "./server/views")); //specify the path for view engine => THis is important
app.set('view engine', 'ejs');

// coonect to mongoose and set up database
let DB = require("./server/config/db");
mongoose.connect(DB.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "connection error:"));
mongodb.once("open", () => {
  console.log("Database Connected");
});



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../public"))); /// HERE
app.use(express.static(path.join(__dirname, "../../node_modules")));

//setup express session
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
  })
);

//initialize flash
app.use(flash());

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

// Create user scheme
const userModel = require('./server/models/user');
let User = userModel.User;

//implement a user authentication Strategy
passport.use(User.createStrategy()); ////

//serialize and deserialize user object info -encrypt and decrypt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error" });
});

// listen for request 
app.listen(3000);

app.use(express.json()); // must  be before the path
// rendering views
app.use(route);
//app.use(usersRouter);
// middleware
app.use(express.static('public'));
http.createServer(app);
console.log("http://localhost:3000")


 
 