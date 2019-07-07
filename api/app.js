'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const ObjectsRoute = require('./routes/objects');
const FilesRoute = require('./routes/files');
const BehavioursRoute = require('./routes/behaviours');

let app = express();

const corsOptions = {
  origin: ['http://localhost:4200'],
  default: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use('/objects', ObjectsRoute);
app.use('/files', FilesRoute);
app.use('/behaviours', BehavioursRoute);

module.exports = app;
