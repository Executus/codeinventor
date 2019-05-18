'use strict';

let express = require('express');
let router = express.Router();

let config = require('../config');
let FileUtility = require('../utilities/file_utility');

/* Get all files */
router.post('/', function(req, res, next) {
  let fileType = req.body.FileType;
  if (fileType !== undefined) {
    FileUtility.getFiles(fileType, function(err, files) {
      if (err) {
        return res.status(500).send(err);
      }
  
      let data = {
        Files: files
      }
      return res.status(200).send(data);
    });
  } else {
    let data = {
      error: 'Bad request - FileType not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Get a file */
router.get('/:filename', function(req, res, next) {
  let filename = req.params.filename;
  return res.sendFile(config.BASE_FILE_DIR + 'tmp/' + filename);
});

module.exports = router;