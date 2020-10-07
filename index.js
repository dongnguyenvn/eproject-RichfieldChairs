const express = require("express");
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8000;

const main = require('./routers/main');

app.listen(PORT,function () {
    console.log("server is running.....");
});


app.use(express.static("public"));
app.set("view engine","ejs");



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))


app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use('/', main);

module.exports = app;