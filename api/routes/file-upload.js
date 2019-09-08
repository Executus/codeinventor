'use strict';

let express = require('express');
let router = express.Router();
const multer = require('multer');
const upload = multer({});

let config = require('../config');
let FileUtility = require('../utilities/file_utility');

/* Upload file */
router.post('/', upload.single('file'), function(req, res, next) {
  let appid = req.query.appid;
  console.log('appid: ' + appid);

  const fileData = '\\x' + req.file.buffer.toString('hex');

  FileUtility.uploadFile(appid, fileData, function(err, fileId) {
    if (err) {
      return res.status(500).send(err);
    }

    let data = {
      FileId: fileId
    }
    return res.status(200).send(data);
  });
});

module.exports = router;