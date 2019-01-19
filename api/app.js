'use strict';

let express = require('express');
let path = require('path');
//var cookieParser = require('cookie-parser');
let logger = require('morgan');
const bodyParser = require('body-parser');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
let ObjectsRoute = require('./routes/objects');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/objects', ObjectsRoute);

module.exports = app;
